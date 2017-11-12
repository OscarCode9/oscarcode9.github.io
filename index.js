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

// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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



app.listen(config.port, () => {
  console.log(`API REST corriendo en http://localhost:${config.port}`)
})
