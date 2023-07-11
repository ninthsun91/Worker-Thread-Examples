import express from 'express';
import { v4 } from 'uuid';

import { EventEmitter } from 'node:events';
import path from 'node:path';
import { Worker } from 'node:worker_threads';

const app = express();

app.get('/workers/primes/:max', (req, res) => {
  const { max } = req.params;

  const jobId = runJob(Number(max));

  const timeout = setTimeout(() => {
    jobEvent.removeListener(jobId, jobHandler);
    restartWorker();
    res.sendStatus(408);
  }, JOB_TIMEOUT)

  const jobHandler = ({ result }: JobResult) => {
    res.status(200).json(result);
    clearTimeout(timeout);
  };
  jobEvent.once(`complete:${jobId}`, jobHandler);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

const workerPath = path.join(__dirname, './worker.js');
let worker = new Worker(workerPath);
const WorkerStatus = {
  IDLE: 'IDLE',
  BUSY: 'BUSY',
} as const;
let workerStatus: WorkerStatus = WorkerStatus.IDLE;

worker.on('message', ({ jobId, result }: JobResult) => {
  workerStatus = WorkerStatus.IDLE;
  jobEvent.emit(`complete:${jobId}`, { result });

  if (jobQueue.length > 0) {
    jobEvent.emit('next');
  }
});

worker.on('error', (err) => {});

const restartWorker = () => {
  worker.terminate();
  worker = new Worker(workerPath);
  workerStatus = WorkerStatus.IDLE;
}

const jobQueue: JobData[] = [];
const jobEvent = new EventEmitter();
const JOB_TIMEOUT = 1000 * 300;

jobEvent.on('next', () => {
  console.log(`Job next`);
  const jobData = jobQueue.shift();
  if (jobData === undefined) return;

  assignJob(jobData);
});

const runJob = (max: number) => {
  const jobId = v4();
  const jobData: JobData = { jobId, max };

  if (workerStatus === WorkerStatus.IDLE) {
    console.log('Worker is idle');
    assignJob(jobData);
  } else if (workerStatus === WorkerStatus.BUSY) {
    console.log('Worker is busy');
    jobQueue.push(jobData);
  }

  return jobId;
}

const assignJob = (jobData: JobData) => {
  workerStatus = WorkerStatus.BUSY;
  worker.postMessage(jobData);
}

export type JobData = {
  jobId: string;
  max: number;
}

export type JobResult = {
  jobId: string;
  result: {
    count: number;
    time: string;
  }
}

type WorkerStatus = typeof WorkerStatus[keyof typeof WorkerStatus];