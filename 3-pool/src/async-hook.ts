import { AsyncResource } from 'node:async_hooks';

export class WorkerAsyncJob extends AsyncResource {
  private success: SuccessCallback;
  private timeout: TimeoutCallback;

  constructor(success: SuccessCallback, timeout: TimeoutCallback) {
    super(WorkerAsyncJob.name);
    this.success = success;
    this.timeout = timeout;
  }

  done(err: Error): void;
  done(err: null, result: JobResult): void;
  done(err: Error|null, result?: JobResult) {
    if (err === null) {
      this.runInAsyncScope(this.success, null, result);
    } else {
      this.runInAsyncScope(this.timeout, null);
    }
    this.emitDestroy();
  }
}
