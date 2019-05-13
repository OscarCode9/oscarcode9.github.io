'use strict'

const { Worker } = require('worker_threads');
function createWorker(workerData) {
  return new Promise((resolver, reject) => {
    const worker = new Worker('./worker.js', {
      workerData
    });

    worker.on('message', message => {
      resolver(message)
    })

    worker.on('error', err  => {
      reject(err)
    })

    worker.on('exit', exit => {
      if(exit !== 0){
        reject(new Error('Something bad happened'))
      }
    })
    
    worker.on('online', online  => {
      console.log(worker.threadId, online)
    })
  })
}


createWorker({
  hello: 'Hello nodejs', number: 1e9
}).then(result => {
  console.log('Worker returns: ', result)
}).catch(err => {
  console.error(err)
})
