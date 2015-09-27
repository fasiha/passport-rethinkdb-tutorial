/*jshint node:true */
'use strict';

var fs = require('fs');
var http = require('http');
var https = require('https');

var config = require('config');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');
var engines = require('consolidate');

var app = express();
var auth = require('./auth');
var authRouter = require('./auth/auth-router');

// Middleware

// Middleware to allow POST/PUT/DELETE/GET requests to reuse cookie
// authentication (see `XMLHttpRequest.withCredentials`).  Thanks to
// http://mortoray.com/2014/04/09/allowing-unlimited-access-with-cors/ for hints
// on what headers to allow. Thankfully cors module does all the hard work.
var corsSetup = cors({
  origin : true,
    allowedHeaders : [ 'Content-Type', 'Authorization', 'Cache-Control' ],
    credentials : true,
    maxAge : 1  // Increase this for production!
});

app
  .use(bodyParser.json())
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
app.use('/auth', authRouter)
    .options('/', corsSetup)
    .get('/',
         function(req, res) { res.render('index.html', {user : req.user}); })
    .post('/', corsSetup, auth.checkIfLoggedIn,
          function(req, res) {
            console.log('received: ', req.body);
            res.status(200).send('Ok');
          })
    .use(express.static(__dirname + '/../client'))
    .use('*',
         function(req, res) { res.status(404).send('404 Not Found').end(); });

https.createServer(
         {
           key : fs.readFileSync(__dirname +
                                 '/../certs/server/my-server.key.pem'),
    cert : fs.readFileSync(__dirname + '/../certs/server/my-server.crt.pem'),
    requestCert : false,
    rejectUnauthorized : true
         },
         app)
    .listen(config.get('ports').https, () => {
      console.log('HTTPS live at https://127.0.0.1:' +
                  config.get('ports').https);
    });

