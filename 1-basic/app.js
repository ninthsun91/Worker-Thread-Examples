const express = require('express');
const { Worker } = require('node:worker_threads');
const path = require('node:path');

const app = express();


app.get('/primes/:max', (req, res) => {
  const { max } = req.params;
  const data = getPrimes(max);
  res.send(data);
});

app.get('/workers/primes/:max', (req, res) => {
  const { max } = req.params;

  const workerPath = path.resolve(__dirname, 'worker.js');
  const workerData = { max }
  const worker = new Worker(workerPath, { workerData });

  worker.on('message', (data) => {
    res.send(data);
  });
});

app.get('/workers/wait', (req, res) => {
  const workerPath = path.resolve(__dirname, 'worker2.js');
  const worker = new Worker(workerPath);

  worker.on('message', (data) => {
    res.send(data);
  });

  setTimeout(() => {
    worker.emit('message', 'OK');
  }, 30000);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});


function getPrimes(max) {
  const start = Date.now();
  const primes = [];

  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }

  const end = Date.now();
  const time = `${Math.floor((end - start) / 1000)} sec`;

  return {
    count: primes.length,
    time,
  };
}
