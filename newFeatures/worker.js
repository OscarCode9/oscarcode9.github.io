'use strict'

const {parentPort, workerData } = require('worker_threads');

let { number , hello } = workerData;

console.time('While');
while(number > 0){
  number--;
}

console.timeEnd('While');

parentPort.postMessage(hello);

