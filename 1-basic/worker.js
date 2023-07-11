const { workerData, parentPort } = require('node:worker_threads');

const { max } = workerData;

const data = getPrimes(max);
parentPort.postMessage(data);

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
