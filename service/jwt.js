const jwt = require('jsonwebtoken');

async function signToken(payload, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(err);
      } else {
        resolve(token);
      }
    })
  })
}
async function verifyToken(token, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, decoded) => {
      if (err) {
        return reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}



module.exports = { signToken, verifyToken };