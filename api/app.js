/*
  Bootlint Online
  Bootlint implementation for remote website
  https://github.com/eduardinni/bootlint-online
*/

var bootlint = require('bootlint');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');

function disabledIdsFor(req) {
  var rawIds = req.query.disable;
  if(!rawIds) {
    return [];
  }
  return rawIds.split(',');
}

function lintsFor(html, disabledIds) {
  var lints = [];
  var reporter = function(lint) {
    lints.push(lint);
  };
  bootlint.lintHtml(html, reporter, disabledIds);
  return lints;
}

var routes = express.Router();

routes.post('/', function(req, res) {
  res.status(200).jsonp({status: 200, message: "Bootlint is online!"});
});

routes.get('/', function(req, res) {
  res.format({
    'application/json': function() {
      var disabledIds = disabledIdsFor(req);
      var url = req.query.url;
      // console.log(JSON.stringify(req.query, null, 2));
      
      request.get(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
          var lints = lintsFor(body, disabledIds);
          lints.forEach(function(lint) {
            lint.elements = undefined;
          });
          // console.log(JSON.stringify(lints, null, 2));
          res.status(200).jsonp(lints);
        }
      });
    },
    'default': function() {
      res.status(406).jsonp({
        status: 406,
        message: 'Not Acceptable', details: '"Accept" header must allow MIME type application/json'
      });
    }
  });
});

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

/*eslint-disable no-unused-vars */
app.use(function(err, req, res, next) {
  var isHttpErr = !!err.status;

  if(!isHttpErr) {
    err.status = 500;
  }

  var errJson = {
    status: err.status,
    message: err.message
  };
  
  if (!isHttpErr) {
    errJson.stack = err.stack;
  }

  res.status(err.status).json(errJson);
});

module.exports = app;
