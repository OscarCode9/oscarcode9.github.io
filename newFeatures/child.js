'use strict'
console.log(process.argv)
let number  = Number(process.argv[2]);
console.time('While')
while (number > 0) {
  number--
}
console.timeEnd('While');

process.send('Hello', number)