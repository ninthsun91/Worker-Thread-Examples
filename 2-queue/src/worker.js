const path = require('node:path');

require('ts-node').register();
require(path.resolve(__dirname, 'worker.ts'));