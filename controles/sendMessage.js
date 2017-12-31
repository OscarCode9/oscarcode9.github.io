const nodemailer = require('nodemailer');
const mysql = require('mysql');
const postExist = require('./postExist');
const saveCorreo = require('./saveCorreo');


function isEmail(email){
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}



async function sendMensaje(req, res, next) {

  console.log('Yamaño del texto --->', req.fields.requerim.length);

  if(req.fields.requerim.length === 0 || req.fields.nombre.length === 0 ){
    return res.status(200).send({message: 'Campos vacios, porfavor llena los campos'});
  }


  const isValidEmail = isEmail(req.fields.email);
  
  if(!isValidEmail){
    return res.status(200).send({message: 'Tu correo no es valido'});
  }

  const idEmail = await saveCorreo(req.fields);
  console.log(Number.isInteger(idEmail));


  if(Number.isInteger(idEmail)){
    return res.status(200).send({message: 'Tu correo se ha enviado, gracias'});
  }else{
    return res.status(200).send({message: 'Hubo problemas al enviar el correo'});
  }

}

function getCometarios(numero, query) {
  var myQuery = query;
  var conn = mysql.createConnection(process.env.DATABASE_URL);

  const promise = new Promise(function (resolve, reject) {
    conn.query(myQuery, function (err, result) {
      if (err) {
        console.log(err)
        conn.end();
        reject(new Error('No existe un array'))
      } else {
        conn.end();
        resolve(result);
      }
    });
  })
  return promise
}

async function QueryPost(req, res, next) {

  const numero = req.query.tagId;
  const postTag = req.query.tagR;
  const postName = req.query.postName;
  console.log(postTag);

  if (req.query.tagId === undefined) {


    let connection;

    connection = mysql.createConnection(process.env.DATABASE_URL);


    connection.connect();
    connection.query(`select idPost, 
    contenido_html,likes,urlImg,
    descripcion, 
    DATE_FORMAT(fecha, "%W %M %e %Y") fecha, namePost from Post`,
      function (err, rows, fields) {
        if (err) {
          connection.end();
          console.log('Error while performing Query.' + err);
        } else {
          connection.query(`select count(idComent) idComment, p.idPost
        from Post p, Comentarios c 
        where p.idPost = c.idPost group by p.idPost`, function (errComm, rowsComm, fieldsComm) {
              rows.forEach(function (elemt) {
                rowsComm.forEach(function (elemtComm) {
                  if (elemt.idPost === elemtComm.idPost) {
                    elemt.comment = elemtComm.idComment;
                  }
                }, this);
              }, this);
              let comentarios = rows;
              connection.end();
              res.render('blog', {
                title: 'Blog | Oscar Code', comentarios: comentarios
              })
            })
        }
      });
  } else {
    

    const resultados = await postExist.postExist(postName);


    console.log(resultados);

    if(resultados){
      return res.render('error', {message: 'Este post no existe en nuestro servidor'});
    }
    

    var conn = mysql.createConnection(process.env.DATABASE_URL);

    var sqlQueryComent = `select C.usuarioname, C.urlPerfil, 
            C.contenido,C.likes,C.idPost, CONCAT(DAY(C.fecha), '-',MONTH(C.fecha), '-',year(C.fecha)) as fecha
            from Post P inner join Comentarios C on P.idPost = C.idPost where C.idPost = ${numero} order by C.fecha desc`;

    var sqlQueryNum = `select count(*) as comNum from Post P inner join Comentarios C on P.idPost = C.idPost where C.idPost = ${numero};`

    var sqlQueryPost = `select * from Post where  idPost = ${numero};`

    var comentarios = null;
    var infPost = null;
    var numeroComentario = null;

    getCometarios(numero, sqlQueryComent)
      .then(function (data) {
        console.log(data);
        comentarios = data;
        return getCometarios(numero, sqlQueryPost);
      })
      .then(function (data) {
        console.log(data)
        infPost = data;
        return getCometarios(numero, sqlQueryNum);
      })
      .then(function (data) {
        numeroComentario = Number(data[0].comNum)
      })
      .then(function () {
        if (typeof comentarios !== 'undefined' && comentarios.length >= 0) {
          res.render(postName, {
            helpers: {
              Frame: function () {
                return infPost[0].contenido_html;
              },
              IdPost: function () {
                return JSON.stringify(numero);

              },
              likeTotal: function () {
                let likes = infPost[0].likes;
                return likes;
              }
            },
            place_urls: JSON.stringify(numero),
            numeroComentario,
            infPost,
            comentarios,
            title: 'Blog | Oscar Code',
          });

        } else {
          res.render('error');
        }
      })
      .catch(err => {
        console.log(err.message)
        res.render('error', {
          message: err.message
        });
      })
  }

}

function QueryComent(req, res, next) {
  console.log(req.fields)
  const numero = req.query.tagId;
  console.log(numero);
  var usuarioname = req.fields.nombre;
  var contenido = req.fields.contenido;
  sqlQueryComent = `
    INSERT INTO Comentarios ( usuarioname, urlPerfil, contenido,likes,idPost,fecha )
     VALUES ('${usuarioname}','https://www.w3schools.com/howto/img_avatar.png',
      '${contenido}',
       0, ${numero}, sysdate());`;
  getCometarios(numero, sqlQueryComent)
    .then(function (data) {
      console.log(data.insertId)
      res.send({
        numero: 'Gracias por comentar<3',
        data: data.insertId
      });
    })
    .catch(function (e) {
      res.send({
        numero: "Hay un erro interno: " + e,
        error: true
      })
    })
}


module.exports = {
  sendMensaje,
  QueryPost,
  QueryComent
}