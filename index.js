var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const formidable = require('express-formidable')
const config = require('./config')
var index = require('./routes/index');
var users = require('./routes/users');
const hbs = require('express-handlebars');
var app = express();


var server = require('http').createServer(app);
var io = require('socket.io')(server);
const mysql2 = require('mysql');


io.on('connection', function (socket) {
  console.log('Un cliente se ha conectado');
  socket.on('new-like', function (data) {
    const connection = mysql2.createConnection('mysql://j8zdtysyz41uv9iq:yniktu2ff31goblf@ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/wcrk58io9f4zgrff');
    connection.connect();
    connection.query('update Post set likes = ? where idPost = ?;', [data.likes, data.postId],
     function (err, rows, fields) {
      if (!err) {
        connection.query('select * from Post where idPost = ?;', [data.postId],
         function (err, rows, fields) {
          if (!err) {
            console.log('The solution is: ', rows);
            let newLike = {
              likes: rows[0].likes,
              postId: rows[0].idPost,
            }
            connection.end();
            io.sockets.emit('newLike', newLike);
          } else {
            connection.end();
            console.log('Error while performing Query select .' +err);
          }
        });
      } else {
        connection.end();
        console.log('Error while performing Query.' + err);
      }
    });
  });

  socket.on('new-comment', function(data){
    const connection = mysql2.createConnection('mysql://j8zdtysyz41uv9iq:yniktu2ff31goblf@ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/wcrk58io9f4zgrff');
    connection.connect();
    connection.query(`select * from  Comentarios where idComent = ${data}`,
    function (err, rows, fields) {
      if (err){
        connection.end();
        console.log('Error while performing Query.' + err);
      }else{
        connection.end();
        console.log(rows[0])
        io.sockets.emit('newComment', rows[0]);
      }
    });

    /*data = JSON.parse(data)
    console.log(data.nombre)*/
    
  });
});


// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(formidable({
  encoding: 'utf-8',
  multiples: true // esta almacena archivos
}))
app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')


app.use('/', index);
app.use('/users', users);


server.listen(config.port, () => {
  console.log(`API REST corriendo en http://localhost:${config.port}`)
})

 

