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
const apiservice = require("./routes/api");
const hbs = require('express-handlebars');
const session = require("express-session");
var app = express();
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const mysql = require('mysql2');


passport.use(new Strategy((username, password, cb) => {
  const conn = mysql.createConnection("mysql://j8zdtysyz41uv9iq:yniktu2ff31goblf@ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/wcrk58io9f4zgrff");
  const querySql = "SELECT * FROM Users WHERE email =? AND password =?; "
  conn.query(querySql, [username, password], (err, results) => {
    if (err) return cb(err);
    if (results[0].password !== password) return cb(null, false);
    return cb(null, results[0]);
  });
}));


passport.serializeUser((user, cb) => {
  cb(null, user.userId);
});

passport.deserializeUser((id, cb) => {
  console.log("que onda user 11", id);
  const conn = mysql.createConnection("mysql://j8zdtysyz41uv9iq:yniktu2ff31goblf@ysp9sse09kl0tzxj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/wcrk58io9f4zgrff");
  const sql = "SELECT * FROM Users WHERE userId =?;";
  conn.query(sql, [id], (err, result) => {
    if (err) return cb(err);
    const user = result[0];
    cb(null, user);
  });
});


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://encryptar.herokuapp.com/');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const mysql2 = require('mysql');


io.on('connection', function (socket) {
  console.log('Un cliente se ha conectado');
  socket.on('new-like', function (data) {
    const connection = mysql2.createConnection(process.env.DATABASE_URL);
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
                console.log('Error while performing Query select .' + err);
              }
            });
        } else {
          connection.end();
          console.log('Error while performing Query.' + err);
        }
      });
  });

  socket.on('new-comment', function (data) {
    const connection = mysql2.createConnection(process.env.DATABASE_URL);
    connection.connect();
    connection.query(`select * from  Comentarios where idComent = ${data}`,
      function (err, rows, fields) {
        if (err) {
          connection.end();
          console.log('Error while performing Query.' + err);
        } else {
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


app.use(express.static(path.join(__dirname, 'public')));
app.use(formidable({
  encoding: 'utf-8',
  multiples: true // esta almacena archivos
}))
app.engine('.hbs', hbs({
  defaultLayout: 'default',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

const jwt = require('./service/jwt');

const SECRET_TOKEN = require('./config/token').SECRET_TOKEN;
app.post('/login', async (req, res, next) => {

  const username = req.fields.username;
  const password = req.fields.password;

  const conn = mysql.createConnection(process.env.DATABASE_URL);
  const querySql = "SELECT * FROM Users WHERE email =? AND password =?; ";
  conn.query(querySql, [username, password], (err, results) => {
    if (err) {
      res.redirect('/');
      //return someth6ing5 if there is error
    } else if (results.length > 0) {

      if (results[0].password === password) {

        const user = results[0];

        const payload = {
          sub: user.userId,
          name: user.firstName,
          admin: true
        }

        jwt.signToken(payload, SECRET_TOKEN, {}).then(token => {
          console.log(token);
          res.status(200).send({
            token,
            error: false
          });
        });

      } else {
        return res.status(401).send({
          message: 'Contraseña incorrecta',
          error: true
        })
      }

    } else {
      return res.status(401).send({
        message: "Email no existe o contraseña incorrecta",
        error: true
      })
    }

  });


});


app.get('/login', (req, res, next) => {
  res.render('login', { layout: false, title: "Login" });
});

app.get('/logout',
  function (req, res) {
    req.logout();
    res.redirect('/');
  });

app.get('/profile', isLoggedIn,

  function (req, res) {
    res.render('profile', { user: req.user });
  });

function isLoggedIn(req, res, next) {

  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");

}

app.use('/api', apiservice);
app.use('/', index);




server.listen(config.port, () => {
  console.log(`OscarCode corriendo en http://localhost:${config.port}`)
})



