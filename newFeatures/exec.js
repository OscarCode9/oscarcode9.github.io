'use strict'
const { exec, spawn } = require('child_process');
const os = require('os');
const path = require('path');

const cwd = path.join(os.homedir(), 'Documents', 'NodejsCourse');

exec('type poem.txt', {
  cwd, 
  maxBuffer: 30,
  timeout: 1000
}, (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('stdout', stdout);
  console.log('stderr', stderr);
})

const ps = spawn('ping', [ '-n', '5', 'google.com']);

ps.stdout.on('data', data => {
  console.log(data)
});

ps.stderr.on('data', data => {
  console.error(data)
})

ps.on('close', (exitCode, signal)=> {
  console.log(exitCode, signal)
})