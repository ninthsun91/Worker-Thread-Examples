import { v4 } from 'uuid';

import { EventEmitter } from 'node:events';
import path from 'node:path';
import { Worker } from 'node:worker_threads';

import { WorkerAsyncJob } from './async-hook';

class WorkerPool extends EventEmitter {
  private readonly WORKER_PATH = path.join(__dirname, 'worker.js');
  private readonly MINIMUM_WORKERS = 2;
  private readonly MAXIMUM_WORKERS = 5;
  private readonly WORKER_TIMEOUT = 1000 * 300;

  private readonly jobQueue: JobQueue[] = [];
  private readonly workerPool: Set<Worker> = new Set<Worker>();
  private readonly freePool: Worker[] = [];
  private readonly asyncResourceMap: Map<Worker, WorkerAsyncJob> = new Map<Worker, WorkerAsyncJob>();

  constructor() {
    super();

    this.initializeWorkers();

    this.on('next', () => {
      console.log('next job');
      const worker = this.getFreeWorker();
      if (worker === undefined) return;

      const job = this.jobQueue.shift();
      if (job === undefined) return;

      this.assignJob(worker, job);
    });
  }

  private initializeWorkers() {
    for (let i = 0; i < this.MINIMUM_WORKERS; i++) {
      this.createWorker();
    }
  }

  private createWorker() {
    const worker = new Worker(this.WORKER_PATH);
    this.workerPool.add(worker);
    this.freePool.push(worker);

    worker.on('message', (result: JobResult) => {
      const asyncResource = this.asyncResourceMap.get(worker);
      if (asyncResource !== undefined) {
        asyncResource.done(null, result);
        this.emit(result.jobId);
      }
      
      if (this.jobQueue.length > 0) {
        this.freePool.push(worker);
        this.emit('next');
        return;
      }

      if (this.workerPool.size > this.MINIMUM_WORKERS) {
        worker.terminate();
        this.workerPool.delete(worker);
        console.log('worker terminated', worker.threadId);
      }

      this.freePool.push(worker);
    });
    
    worker.on('error', (err) => {
      console.log('worker error', err);
    });

    worker.on('exit', (code) => {
      console.log('worker exit', code);
    })

    console.log('worker created', worker.threadId);
    return worker;
  }

  public runJob(max: number, success: SuccessCallback, timeout: TimeoutCallback) {
    const jobId = v4();
    const jobData: JobData = { jobId, max };
    const job = { jobData, success, timeout };

    const worker = this.getFreeWorker();
    if (worker === undefined) {
      this.jobQueue.push(job);
    } else {
      this.assignJob(worker, job);
    }

    return jobId;
  }

  private getFreeWorker() {
    if (this.freePool.length > 0) {
      console.log('free worker found');
      return this.freePool.pop();
    } else if (this.workerPool.size < this.MAXIMUM_WORKERS) {
      this.createWorker();
      return this.freePool.pop();
    } else {
      console.log('no worker available. add to queue');
      return undefined;
    }
  }

  private assignJob(worker: Worker, { jobData, success, timeout }: JobQueue) {
    this.asyncResourceMap.set(worker, new WorkerAsyncJob(success, timeout));
    worker.postMessage(jobData);

    const timer = setTimeout(() => {
      console.log('job timeout', jobData.jobId)
      this.terminateWorker(worker);
      const asyncResource = this.asyncResourceMap.get(worker);
      asyncResource?.done(new Error('timeout'));
    }, this.WORKER_TIMEOUT);

    this.on(jobData.jobId, () => clearTimeout(timer));
  }

  private terminateWorker(worker: Worker) {
    worker.terminate();
    this.workerPool.delete(worker);

    if (this.workerPool.size < this.MINIMUM_WORKERS) {
      this.createWorker();
    }
  }

  status() {
    console.log('worker pool status');
    console.log('free pool', this.freePool.length);
    console.log('worker pool', this.workerPool.size);
    console.log('job queue', this.jobQueue.length);
  }
}

export const pool = new WorkerPool();
