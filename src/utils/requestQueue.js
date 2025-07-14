/**
 * Request Queue Manager
 * Controls concurrent API requests to prevent rate limiting
 * Implements a queue with configurable concurrency limits
 */

class RequestQueue {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 3; // Max concurrent requests
    this.delay = options.delay || 100; // Delay between requests (ms)
    this.queue = [];
    this.running = 0;
    this.paused = false;
  }

  // Add a request to the queue
  async add(requestFunction, priority = 0) {
    return new Promise((resolve, reject) => {
      const request = {
        fn: requestFunction,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex(item => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(request);
      } else {
        this.queue.splice(insertIndex, 0, request);
      }

      this.process();
    });
  }

  // Process the queue
  async process() {
    if (this.paused || this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const request = this.queue.shift();
    this.running++;

    try {
      // Add delay to prevent overwhelming the API
      if (this.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, this.delay));
      }

      const result = await request.fn();
      request.resolve(result);
    } catch (error) {
      request.reject(error);
    } finally {
      this.running--;
      // Process next item in queue
      setTimeout(() => this.process(), 0);
    }
  }

  // Pause the queue
  pause() {
    this.paused = true;
    console.log('🚫 Request queue paused');
  }

  // Resume the queue
  resume() {
    this.paused = false;
    console.log('▶️ Request queue resumed');
    this.process();
  }

  // Clear the queue
  clear() {
    const clearedCount = this.queue.length;
    this.queue.forEach(request => {
      request.reject(new Error('Request cancelled - queue cleared'));
    });
    this.queue = [];
    console.log(`🗑️ Cleared ${clearedCount} requests from queue`);
  }

  // Get queue statistics
  getStats() {
    return {
      queueLength: this.queue.length,
      running: this.running,
      maxConcurrent: this.maxConcurrent,
      paused: this.paused,
      oldestRequest: this.queue.length > 0 ? Date.now() - this.queue[this.queue.length - 1].timestamp : 0
    };
  }

  // Update configuration
  configure(options) {
    if (options.maxConcurrent !== undefined) {
      this.maxConcurrent = Math.max(1, options.maxConcurrent);
    }
    if (options.delay !== undefined) {
      this.delay = Math.max(0, options.delay);
    }
    console.log(`⚙️ Queue configured: maxConcurrent=${this.maxConcurrent}, delay=${this.delay}ms`);
  }
}

// Create a global request queue instance
const globalQueue = new RequestQueue({
  maxConcurrent: 3,
  delay: 100
});

// Wrapper function to easily queue API requests
export const queueRequest = (requestFunction, priority = 0) => {
  return globalQueue.add(requestFunction, priority);
};

// Queue management utilities
export const queueManager = {
  pause: () => globalQueue.pause(),
  resume: () => globalQueue.resume(),
  clear: () => globalQueue.clear(),
  getStats: () => globalQueue.getStats(),
  configure: (options) => globalQueue.configure(options)
};

// Priority constants for common request types
export const PRIORITY = {
  CRITICAL: 100,  // Auth, user data
  HIGH: 75,       // Current playlist, playing track
  NORMAL: 50,     // General playlists, search
  LOW: 25,        // Background data, analytics
  BACKGROUND: 0   // Prefetching, cache warming
};

export default {
  queueRequest,
  queueManager,
  PRIORITY,
  RequestQueue
};