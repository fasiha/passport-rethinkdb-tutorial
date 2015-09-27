/*jshint node:true */
'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');

var config = require('config');
var express = require('express');
var session = require('express-session');
var engines = require('consolidate');

var app = express();
var auth = require('./auth');
var authRouter = require('./auth/auth-router');

// Middleware
app
  .use(session({
    secret: config.get('sessionSecret'),
    resave: false,
    saveUninitialized: true
  }))
  .use(auth.initialize())
  .use(auth.session());

// Views
app
  .set('views', __dirname + '/views')
  .engine('html', engines.mustache)
  .set('view engine', 'html');

// Routes
app.use((req, res, next) => {
     if (!req.secure) {
       return res.redirect('https://' + req.get('Host') + req.url);
     }
     next();
   })
    .use('/auth', authRouter)
    .get('/',
         function(req, res) { res.render('index.html', {user : req.user}); })
    .use(express.static(__dirname + '/../client'))
    .use('*',
         function(req, res) { res.status(404).send('404 Not Found').end(); });

https.createServer(
         {
           key : fs.readFileSync(__dirname + '/../certs/server/my-server.key.pem'),
           cert : fs.readFileSync(__dirname + '/../certs/server/my-server.crt.pem'),
           requestCert : false,
           rejectUnauthorized : true
         },
         app)
    .listen(config.get('ports').https, () => {
      console.log(
          `HTTPS live at https://localhost:${config.get('ports').https}`);
    });

