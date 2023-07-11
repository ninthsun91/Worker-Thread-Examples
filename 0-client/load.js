const axios = require('axios');

const TARGET_HOST = 'http://localhost:3000';
const TARGET_ENDPOINT = '/workers/primes/10000000';
const TARGET_REQUEST_COUNT = 20;

const promises = [];
const start = Date.now();
for (let i = 0; i < TARGET_REQUEST_COUNT; i++) {
  const url = TARGET_HOST + TARGET_ENDPOINT;
  const request = axios.get(url);
  promises.push(request);
}

promises.forEach(async (promise, index) => {
  const response = await promise;
  const responseTime = (Date.now() - start)/1000;
  console.log(index, response.data, `(${responseTime} sec)`);
});