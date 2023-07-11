const { parentPort } = require('node:worker_threads');

parentPort.on('message', (data) => {
  console.log(data);
  parentPort.postMessage('Done');
});