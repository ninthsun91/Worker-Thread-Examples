import express from 'express';
import { pool } from './pool';
import './types';

const app = express();

app.get('/workers/primes/:max', (req, res) => {
  const { max } = req.params;

  const successCallback = ({ result }: JobResult) => {
    console.log(`Job ${jobId} finished`);
    res.status(200).json(result);
  };
  const timeoutCallback = () => {
    console.log(`Job ${jobId} timeout`);
    res.sendStatus(408);
  }
  const jobId = pool.runJob(Number(max), successCallback, timeoutCallback);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
