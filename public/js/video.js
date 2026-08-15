
const userVideo = document.getElementById('user-video');
const toggleCameraBtn = document.getElementById('toggle-camera');
const toggleRecordingBtn = document.getElementById('toggle-recording');
const videoStatus = document.getElementById('video-status');

let cameraStream = null;
let tabStream = null;
let mediaRecorder = null;
let recordedChunks = [];

async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    userVideo.srcObject = cameraStream;
    toggleCameraBtn.textContent = 'Stop Camera';
    toggleCameraBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    toggleCameraBtn.classList.add('bg-red-600', 'hover:bg-red-700');
    videoStatus.textContent = 'Camera started.';
  } catch (error) {
    console.error('Error accessing camera:', error);
    videoStatus.textContent = 'Failed to start camera.';
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    userVideo.srcObject = null;
    cameraStream = null;

    toggleCameraBtn.textContent = 'Start Camera';
    toggleCameraBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
    toggleCameraBtn.classList.add('bg-green-600', 'hover:bg-green-700');
    videoStatus.textContent = 'Camera stopped.';
  }
}

async function toggleCamera() {
  if (cameraStream) {
    stopCamera();
  } else {
    await startCamera();
  }
}

async function startRecording() {
  try {
    tabStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(tabStream, {
      mimeType: 'video/webm'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'tab-recording.webm';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      if (tabStream) {
        tabStream.getTracks().forEach(track => track.stop());
        tabStream = null;
      }

      toggleRecordingBtn.textContent = 'Start Recording';
      toggleRecordingBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600', 'text-black');
      toggleRecordingBtn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white');
      videoStatus.textContent = 'Recording stopped and downloaded.';
    };

    mediaRecorder.start();

    toggleRecordingBtn.textContent = 'Stop Recording';
    toggleRecordingBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white');
    toggleRecordingBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600', 'text-black');
    videoStatus.textContent = 'Tab recording started.';
  } catch (error) {
    console.error('Error recording tab:', error);
    videoStatus.textContent = 'Failed to start recording.';
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    stopRecording();
  } else {
    startRecording();
  }
}

toggleCameraBtn.addEventListener('click', toggleCamera);
toggleRecordingBtn.addEventListener('click', toggleRecording);