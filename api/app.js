/*
  Bootlint Online
  Bootlint implementation for remote website
  https://github.com/eduardinni/bootlint-online
*/

var bootlint = require('bootlint');
var _extend = require('util')._extend;
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
var pg = require('pg');

var conString = process.env.DATABASE_URL;

function shallowClone(obj) {
  return _extend({}, obj);
}

function disabledIdsFor(req) {
  var rawIds = req.query.disable;
  if(!rawIds) {
    return [];
  }
  return rawIds.split(',');
}

function lintsFor(html, disabledIds) {
  var lints = [];
  var reporter = function (lint) {
    var output = false;
    if (lint.elements && lint.elements.length) {
      var elements = lint.elements;
      lint.elements = undefined;
      elements.each(function (_, element) {
        if (element.startLocation) {
          var locatedLint = shallowClone(lint);
          locatedLint.location = element.startLocation;
          lints.push(locatedLint);
          output = true;
        }
      });
    }
    if (!output) {
      lint.elements = undefined;
      lints.push(lint);
    }
  };

  bootlint.lintHtml(html, reporter, disabledIds);
  return lints;
}

function updateLintCounter(lints) {
  pg.defaults.poolSize = 0; // pooling will be disabled
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('database connection error', err);
    }

    lints.forEach(function(lint) {
      client.query('UPDATE lints SET count = count + 1 WHERE id = $1', [lint.id], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
      });
    });
    pg.end();
  });
}

var routes = express.Router();

routes.get('/', function(req, res) {
  res.jsonp({status: 200, message: "Bootlint is online!"});
});

routes.post('/check', function(req, res) {
  res.format({
    'application/json': function() {
      var disabledIds = disabledIdsFor(req);

      if(req.body.checkby != null && req.body.data != null) {
        if(req.body.checkby == 'url'){
          var url = req.body.data;
          request.get(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
              console.log(response.headers);
              var lints = lintsFor(body, disabledIds);

              // W001 and W002 can be corrected via HTTP headers, let's check it...
              var lintsToClean = [];
              var filterlints = lints.forEach(function(lint, idx) {
                if(lint.id == 'W001') {
                  if(response.headers['content-type'].toLowerCase().indexOf('charset=utf-8') > -1) {
                    lintsToClean.push(idx);
                  }
                }
                if(lint.id == 'W002') {
                  if(response.headers['x-ua-compatible'].toLowerCase().indexOf('ie=edge') > -1) {
                    lintsToClean.push(idx);
                  }
                }
              });

              // Clean lints array for W001 and W002 successfully corrected in HTTP headers
              if(lintsToClean.length > 0) {
                while((idx=lintsToClean.pop()) != null) {
                  lints.splice(idx, 1);
                }
              }

              updateLintCounter(lints);
              res.json({lints: lints, error: null});
            }
            else {
              res.json({lints: {}, error: "There is a problem requesting the URL you submitted (maybe 404, 500 error code, or takes too long to load)."});
            }
          });
        }
        else if(req.body.checkby == 'code') {
          if(req.body.data != null) {
            var dibody = req.body.data;
            var dilints = lintsFor(dibody, disabledIds);
            updateLintCounter(dilints);
            res.json({lints: dilints, error: null});
          }
          else {
            res.json({lints: {}, error: "There is a problem with the code you submitted, maybe you didn't paste it completely (try again copying from &lt;html&gt; to &lt;/html&gt;)."});
          }
        }
      }
      else {
        res.json({lints: {}, error: "There is a problem with the data you submitted, please try again."});
      }
    },
    'default': function() {
      res.status(406).json({
        status: 406,
        message: 'Not Acceptable', details: '"Accept" header must allow MIME type application/json'
      });
    }
  });
});

routes.get('/stats', function(req, res) {
  res.format({
    'application/json': function() {
      var client = new pg.Client(conString);
      client.connect(function(err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        client.query('SELECT id, description FROM lints ORDER BY count DESC LIMIT 5', function(err, result) {
          if(err) {
            return console.error('error running query', err);
          }
          res.status(200).jsonp(result.rows);
          client.end();
        });
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
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
