
const userVideo = document.getElementById('user-video');
const toggleCameraBtn = document.getElementById('toggle-camera');
const toggleRecordingBtn = document.getElementById('toggle-recording');
const videoStatus = document.getElementById('video-status');
const liveCaption = document.getElementById('live-caption');

let cameraStream = null;
let tabStream = null;
let mediaRecorder = null;
let recordedChunks = [];

let recognition = null;
let recognitionEnabled = false;
let finalTranscript = '';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function initSpeechRecognition() {
  if (!SpeechRecognition) {
    liveCaption.textContent = 'Live captions are not supported in this browser.';
    return;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    const combined = (finalTranscript + interimTranscript).trim();
    liveCaption.textContent = combined || 'Listening…';
    liveCaption.scrollTop = liveCaption.scrollHeight;
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };

  recognition.onend = () => {
    if (recognitionEnabled) {
      try {
        recognition.start();
      } catch (e) {
        console.error('Speech recognition restart error:', e);
      }
    }
  };
}

function startCaptions() {
  if (!recognition) return;
  recognitionEnabled = true;
  try {
    recognition.start();
    if (!finalTranscript.trim()) {
      liveCaption.textContent = 'Listening…';
    }
  } catch (error) {
    console.error('Speech recognition start error:', error);
  }
}

function stopCaptions() {
  recognitionEnabled = false;
  if (recognition) {
    try {
      recognition.stop();
    } catch (error) {
      console.error('Speech recognition stop error:', error);
    }
  }
}

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
    startCaptions();
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
  }

  stopCaptions();

  toggleCameraBtn.textContent = 'Start Camera';
  toggleCameraBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
  toggleCameraBtn.classList.add('bg-green-600', 'hover:bg-green-700');

  videoStatus.textContent = 'Camera stopped.';
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

    const videoTrack = tabStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.onended = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };
    }

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

initSpeechRecognition();

toggleCameraBtn.addEventListener('click', toggleCamera);
toggleRecordingBtn.addEventListener('click', toggleRecording);