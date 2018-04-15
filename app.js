var express = require('express');
var path = require('path');
var mustacheExpress = require('mustache-express')
var indexRouter = require('./routes/index');
var bodyParser = require('body-parser')

var app = express();

// view engine setup
app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', indexRouter);

module.exports = app;
