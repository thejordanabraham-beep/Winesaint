/**
 * PARALLEL EXECUTION QUEUE
 *
 * Run multiple guide generations simultaneously with:
 * - Configurable concurrency (default: 2)
 * - Rate limiting (50 requests/minute)
 * - Exponential backoff retry (max 3 retries)
 * - Timeout per task (5 minutes)
 * - Graceful shutdown on Ctrl+C
 */

export interface QueueConfig {
  concurrency?: number;        // Number of parallel tasks (default: 2)
  rateLimit?: number;          // Max requests per minute (default: 50)
  timeout?: number;            // Timeout per task in ms (default: 300000 = 5 min)
  retryConfig?: RetryConfig;   // Retry configuration
}

export interface RetryConfig {
  maxRetries?: number;         // Max retry attempts (default: 3)
  initialDelay?: number;       // Initial delay in ms (default: 2000)
  backoffMultiplier?: number;  // Delay multiplier (default: 2)
}

export interface QueueTask<T> {
  id: string;
  name: string;
  fn: () => Promise<T>;
  priority?: number;           // Optional priority (lower = higher priority)
}

export interface QueueResult<T> {
  id: string;
  name: string;
  success: boolean;
  result?: T;
  error?: Error;
  attempts: number;
  duration: number;            // Duration in ms
}

export interface QueueProgress {
  total: number;
  completed: number;
  inProgress: number;
  failed: number;
  successful: number;
  currentTasks: string[];
}

type ProgressCallback = (progress: QueueProgress) => void;

/**
 * Parallel queue with rate limiting and retry logic
 */
export class ParallelQueue<T> {
  private config: Required<QueueConfig>;
  private tasks: QueueTask<T>[] = [];
  private results: QueueResult<T>[] = [];
  private running = false;
  private stopped = false;
  private progressCallbacks: ProgressCallback[] = [];
  private requestTimestamps: number[] = [];

  constructor(config: QueueConfig = {}) {
    this.config = {
      concurrency: config.concurrency ?? 2,
      rateLimit: config.rateLimit ?? 50,
      timeout: config.timeout ?? 300000, // 5 minutes
      retryConfig: {
        maxRetries: config.retryConfig?.maxRetries ?? 3,
        initialDelay: config.retryConfig?.initialDelay ?? 2000,
        backoffMultiplier: config.retryConfig?.backoffMultiplier ?? 2,
      },
    };
  }

  /**
   * Add a task to the queue
   */
  add(task: QueueTask<T>): void {
    this.tasks.push(task);
  }

  /**
   * Register a progress callback
   */
  onProgress(callback: ProgressCallback): void {
    this.progressCallbacks.push(callback);
  }

  /**
   * Run all tasks in the queue
   */
  async run(): Promise<QueueResult<T>[]> {
    if (this.running) {
      throw new Error('Queue is already running');
    }

    this.running = true;
    this.stopped = false;
    this.results = [];

    // Sort by priority (lower number = higher priority)
    this.tasks.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

    // Setup graceful shutdown
    this.setupShutdownHandler();

    const taskQueue = [...this.tasks];
    const activePromises = new Map<string, Promise<void>>();

    while (taskQueue.length > 0 || activePromises.size > 0) {
      // Check if we should stop
      if (this.stopped) {
        console.log('\n🛑 Stopping queue gracefully...');
        break;
      }

      // Start new tasks if we have capacity
      while (
        taskQueue.length > 0 &&
        activePromises.size < this.config.concurrency &&
        !this.stopped
      ) {
        // Check rate limit
        await this.waitForRateLimit();

        const task = taskQueue.shift()!;
        const promise = this.executeTask(task).then(() => {
          activePromises.delete(task.id);
          this.notifyProgress(taskQueue.length, activePromises);
        });

        activePromises.set(task.id, promise);
        this.notifyProgress(taskQueue.length, activePromises);
      }

      // Wait for at least one task to complete
      if (activePromises.size > 0) {
        await Promise.race(activePromises.values());
      }
    }

    // Wait for remaining tasks
    await Promise.all(activePromises.values());

    this.running = false;
    return this.results;
  }

  /**
   * Stop the queue gracefully
   */
  async stop(): Promise<void> {
    this.stopped = true;
  }

  /**
   * Execute a single task with retry logic and timeout
   */
  private async executeTask(task: QueueTask<T>): Promise<void> {
    const startTime = Date.now();
    const result: QueueResult<T> = {
      id: task.id,
      name: task.name,
      success: false,
      attempts: 0,
      duration: 0,
    };

    try {
      const taskResult = await withRetry(
        () => this.executeWithTimeout(task.fn),
        this.config.retryConfig
      );

      result.success = true;
      result.result = taskResult;
      result.attempts = 1; // Will be updated by retry logic if needed
    } catch (error) {
      result.success = false;
      result.error = error as Error;
    } finally {
      result.duration = Date.now() - startTime;
      this.results.push(result);
    }
  }

  /**
   * Execute a function with timeout
   */
  private async executeWithTimeout(fn: () => Promise<T>): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error('Task timeout')),
          this.config.timeout
        )
      ),
    ]);
  }

  /**
   * Wait if we've hit the rate limit
   */
  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove old timestamps
    this.requestTimestamps = this.requestTimestamps.filter(t => t > oneMinuteAgo);

    // Check if we're at the limit
    if (this.requestTimestamps.length >= this.config.rateLimit) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = oldestTimestamp + 60000 - now;

      if (waitTime > 0) {
        await sleep(waitTime);
      }
    }

    // Record this request
    this.requestTimestamps.push(Date.now());
  }

  /**
   * Notify progress callbacks
   */
  private notifyProgress(remaining: number, active: Map<string, Promise<void>>): void {
    const completed = this.results.length;
    const total = this.tasks.length;
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;

    const currentTasks = this.tasks
      .filter(t => active.has(t.id))
      .map(t => t.name);

    const progress: QueueProgress = {
      total,
      completed,
      inProgress: active.size,
      failed,
      successful,
      currentTasks,
    };

    this.progressCallbacks.forEach(cb => cb(progress));
  }

  /**
   * Setup Ctrl+C handler for graceful shutdown
   */
  private setupShutdownHandler(): void {
    const handler = () => {
      if (!this.stopped) {
        this.stop();
      }
    };

    process.once('SIGINT', handler);
    process.once('SIGTERM', handler);
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const maxRetries = config.maxRetries ?? 3;
  const initialDelay = config.initialDelay ?? 2000;
  const backoffMultiplier = config.backoffMultiplier ?? 2;

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      console.log(`   ⚠️  Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
      delay *= backoffMultiplier;
    }
  }

  throw lastError || new Error('All retry attempts failed');
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate estimated completion time
 */
export function estimateCompletionTime(
  completed: number,
  total: number,
  elapsedMs: number
): number {
  if (completed === 0) return 0;

  const avgTimePerTask = elapsedMs / completed;
  const remaining = total - completed;
  return avgTimePerTask * remaining;
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}
