const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const mysqlConnection = require('../config/db');
const LocalStrategy = require("passport-local").Strategy;
const deleteEmailByid = require('../controles/deleteEmail');
const isAuth = require('../middleware/auth');


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

router.get('/getPosts', async (req,res, next)=>{
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

  const file = req.file;
  console.log(file);

});

module.exports = router;
