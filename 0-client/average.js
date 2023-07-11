const axios = require('axios');
const performace = require('node:perf_hooks').performance;

const TARGET_HOST = 'http://localhost:3000';
const TARGET_ENDPOINT = '/workers/primes/10';
const TARGET_REQUEST_COUNT = 100;

let sum = 0;

async function main() {
  for (let i = 0; i < TARGET_REQUEST_COUNT; i++) {
    const start = performace.now();
    const url = TARGET_HOST + TARGET_ENDPOINT;
    const { data } = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
      }
    });

    const responseTime = (performace.now() - start) // 1000;
    sum += responseTime;

    console.log(data, `(${responseTime} ms)`);
  }

  console.log(`Average response time: ${sum / TARGET_REQUEST_COUNT} ms`);
}

main();