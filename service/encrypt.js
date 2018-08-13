const encryptor = require('file-encryptor');

class Encrypt {
    constructor(){
        this.keyEncrypt = '';
    }
    setKeyEncrypt(key){
        this.keyEncrypt = key;
    }

    encryptData(filePath, fileName, cb) {
        encryptor.encryptFile(filePath, fileName , this.keyEncrypt, function (err) {
            return cb(err);
        });
    }

    decryptData(filePath, fileName, cb) {
        encryptor.decryptFile(filePath, fileName, this.keyEncrypt, function (err) {
            return cb(err);
        });
    }
}


module.exports = Encrypt;