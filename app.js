/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./conf/config.json')
  , path = require('path')
  , http = require('http')
  , RedisStore = require('connect-redis')(express)
  , connect = require('connect')
  , md = require('marked').parse
  , flash = require('connect-flash');

var app = express();

// use the html view
app.engine('html', require('ejs').renderFile);

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
    app.use(express.bodyParser(
        {uploadDir: __dirname + '/public/images/'}
    ));
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: config.session_secret,
      store: new RedisStore({
            host: config.redis_host,
            port: config.redis_port,
            pass: config.redis_pass
        })
    }));
    app.use(flash());
    app.use(app.router);
    // should be placed before express.static
    app.use(express.compress({
      filter: function (req, res) {
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
      },
      level: 9
    }));
    app.use(connect.static(__dirname + '/public', {maxAge: 86400000}));
    app.use(express.favicon(__dirname + '/public/images/favicon.ico'), {
        maxAge: 2592000000
    });
});

// config the route rules express
routes(app);

app.use(function(err, req, res, next) {
  // treat as 404
  if (~err.message.indexOf('not found'))
    return next();

  // log it
  console.error(err.stack);

  // error page
  // res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use(function(req, res, next) {
  res.status(404).render('404', { url: req.originalUrl, session: req.session });
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

if (!module.parent) {
    app.listen(app.get('port'));
    console.log("Express server listening on port " + app.get('port'));
}
