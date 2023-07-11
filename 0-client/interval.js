const axios = require('axios');

const TARGET_HOST = 'http://localhost:3000';
const TARGET_ENDPOINT = '/workers/primes/100000000';
const TARGET_REQUEST_COUNT = 4;
const REQUEST_INTERVAL_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  for (let i = 0; i < TARGET_REQUEST_COUNT; i++) {
    const url = TARGET_HOST + TARGET_ENDPOINT;
    axios.get(url).then(({ data }) => console.log(data));
    await sleep(REQUEST_INTERVAL_MS);
  }  
}

main();