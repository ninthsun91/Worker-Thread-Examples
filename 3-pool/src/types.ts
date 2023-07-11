type JobData = {
  jobId: string;
  max: number;
}

type SuccessCallback = (result: JobResult) => void;
type TimeoutCallback = () => void;
type JobQueue = {
  jobData: JobData;
  success: SuccessCallback;
  timeout: TimeoutCallback;
}

type JobResult = {
  jobId: string;
  result: {
    count: number;
    time: string;
  }
}
