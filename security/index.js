const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = '1997041813Oscar&%$12';


const encrypt = (text) =>{
  const cipher = crypto.createCipher(algorithm, secretKey);
  let crypted = cipher.update(text,'utf8','hex');
  crypted+=cipher.final('hex');
  return crypted;
}

const decrypt = (text) => {
  const decipher = crypto.createCipher(algorithm, secretKey);
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}


const secretAuth = '​​​​​62225f3e95c1ed7bd423474edc77f093c466';