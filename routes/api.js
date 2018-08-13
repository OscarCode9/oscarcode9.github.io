const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const mysqlConnection = require('../config/db');
const LocalStrategy = require("passport-local").Strategy;
const deleteEmailByid = require('../controles/deleteEmail');
const isAuth = require('../middleware/auth');
const EncryptFile = require('../service/encrypt');
const fs = require('fs');

const getAllEmail = require('../controles/getEmail');

router.delete('/deleteEmailById/:id', async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const result = await deleteEmailByid(id);

  if (result.affectedRows > 0) {

    res.send({
      result,
      error: false,
      message: `El correo ha sido eliminado`
    });


  } else {

    res.send({
      result,
      error: true,
      message: `No se ha borrado el correo`
    });

  }
});

router.get('/getPosts', async (req, res, next) => {
  const post = require('../post/postsInfo.json').posts;
  res.status(200).send({
    post: post
  });
});


router.get('/getAllEmail', isAuth, async (req, res, next) => {

  const allEmails = await getAllEmail();

  res.send({
    result: allEmails
  });



});

router.get("/testUser", async (req, res, next) => {
  const email = req.query.email;
  const password = req.query.password;


  try {
    const connection = await mysql.createConnection(mysqlConnection);
    const sql = `SELECT * FROM Users WHERE email =? AND password=?`;

    const [rows, fields] = await connection.execute(sql, [email, password]);

    let user = rows;

    if (user.length > 0) {
      res.send(user);
    } else {
      res.send({
        user: "this user don{'t exist"
      })
    }



  } catch (error) {
    console.log('Error in the connection: ', error);
    return error;
  }
})

router.post('/updateFile', (req, res, next) => {

  const file = req.files.img;
  const ext = file.name.split('.')[1];

  const password = req.fields.passwordFile;

  if (password.length > 3) {

    const filePath = file.path;
    const fileName = req.sessionID;

    const myEncrypt = new EncryptFile();

    myEncrypt.setKeyEncrypt(password);

    myEncrypt.encryptData(filePath, fileName + '.' + ext, (err) => {
      if (err) {
        res.status(400).send({
          error: true,
          message: 'Error while we were encrypting file'
        });
      } else {
        res.status(200).send({
          error: false,
          message: 'Encrypted success',
          fileName: fileName + '.' + ext
        });
      }
    });

  } else {
    res.status(400).send({
      error: 400,
      message: 'The password is no valid'
    })
  }
});

router.post('/decryptFile', (req, res, next) => {
  const file = req.files.img;
  const ext = file.name.split('.')[1];
  const password = req.fields.passwordFile;


  const fileName = file.name;
  const filePath = file.path;

  const newName = 'out_'+fileName;

  if (password.length > 3) {

    const myEncrypt = new EncryptFile();

    myEncrypt.setKeyEncrypt(password);

    myEncrypt.decryptData(filePath, newName, (err)=> {
      if(err){
        res.status(400).send({
          error: true,
          message: 'Error while we were encrypting file, Incorrect password'
        });
      }else{
        res.status(200).send({
          error: false,
          message: 'Encrypted success',
          fileName: newName
        });
      }
    });
  }else{
    res.status(400).send({
      error: 400,
      message: 'The password is no valid'
    })
  }

});

router.get('/download/:fileName', (req, res, next) => {
  const fileName = req.params.fileName;
  res.download(fileName, (err) => {
    if (err) {
      console.log(err);
    } else {
      fs.unlink(fileName, (error) => {
        if (error) {
          console.log('Error while deleted file')
        } else {
          console.log('File deleted');
        }
      });
    }
  });

});

module.exports = router;
