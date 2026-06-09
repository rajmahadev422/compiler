class JobQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  add(job) {
    this.queue.push(job);
    this.process();
  }

  async process() {
    if (this.processing) return;
    if (this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();

      try {
        await job();
      } catch (err) {
        console.error(err);
      }
    }

    this.processing = false;
  }
}

export default new JobQueue();