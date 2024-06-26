const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session")
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const mysqlStore = require('express-mysql-session')(session)
const connection = require("./database/db")


const indexRouter = require('./routes/index')


const app = express();
app.use(bodyParser.json())


app.use(session({
  secret: 'tfgsession',
  resave: false,
  saveUninitialized: false,
  store: new mysqlStore({},connection)
}))






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use((req, res, next) => {
  res.status(404).render('404');
});

  

module.exports = app;
