import chokidar from 'chokidar';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {clean} from 'require-clean';
import {exec} from 'child_process';
import proxy from 'express-http-proxy';
import session from 'express-session';
import url from 'url';
import fs from 'fs';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';
import password from './data/password.js';
import jSend from 'proto-jsend';
import config from './loadConfig';
let redisStore = require('connect-redis')(session);
const db = require('./data/' + config.database + '.js');

let APP_PORT = 3000;
let WEBPACK_PORT = 8080; 

let devServer;
let appServer;
let redirectServer;

if (process.env.NODE_ENV === 'production') {
  APP_PORT = 80;
  if (config.ssl) {
    APP_PORT = 443;
  }
}


function startExpressAppServer(callback) {
  var app = express(options)
  clean('./data/schema');
  const {Schema} = require('./data/schema');

  app.use(bodyParser());
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(session({
    secret: 'keyboard cat',
    store: new redisStore({ host: 'localhost', port: 6379}),
    resave: false,
    saveUninitialized: true
  }));

  app.use(jSend);

  app.post('/login', function (req, res) {
    // get a user by email.
    db.getUserByEmail(req.body.email).then(function (user) {
      if (!user) {
        return res.jSend.fail({
          code: 404,
          message: 'Could not find user with email: ' + req.body.email
        });
      }
      password.matchesHash(req.body.password, user.password, function (err, match) {
        if (err) {
          return res.jSend.error(err);
        } 
        if (match) {
					if (!req.session) {
						throw new Error('req.session is undefined, perhaps redis server is not running?');
					}
          req.session.user = {email: user.email, id: user.id};
          res.cookie('tagpadlogin', 'true', { maxAge: 900000, httpOnly: false });
          return res.jSend();
        } else {
          return res.jSend.fail({message: 'Incorrect password'})
        }
      });
    });
  });

  app.post('/logout', function (req, res) {
    req.session.destroy(function(err){
      if (err) {
        res.jSend.error(err);
      } else {
          res.cookie('tagpadlogin', 'false', { maxAge: 900000, httpOnly: false });
          res.jSend();
      }
    });
  });

  app.use('/graphql', graphQLHTTP(function (req, res) {
    return {
      graphiql: true,
      context: req.session,
      pretty: true,
      schema: Schema
    }
  }));
 
  // when in production server these, in dev they are served by webpack dev server. 
  if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(__dirname + '/static'));
    app.use('/', express.static(__dirname + '/client'));
  } else {
    app.use('/', proxy('http://localhost:' + WEBPACK_PORT + '/'));
  }

  let options = config.ssl ? {
      key: fs.readFileSync(config.ssl.key),
      cert: fs.readFileSync(config.ssl.cert),
			ca: fs.readFileSync(config.ssl.ca)
  } : null;

	if (process.env.NODE_ENV === 'production' && config.ssl) {
    appServer = https.createServer(options, app).listen(APP_PORT, function () {
      console.log(`App is now running on https://localhost:${APP_PORT}`);
      if (callback) {
        callback();
      }
    });
    // redirect from http to https
    let redirectApp = express();
    // set up a route to redirect http to https
    redirectApp.get('*',function(req, res){  
      res.redirect('https://' + req.headers.host + req.url)
    });
    redirectServer = http.createServer(redirectApp);
    // have it listen on 8080
    redirectServer.listen(80);
	} else {
    appServer = app.listen(APP_PORT, () => {
      console.log(`App is now running on http://localhost:${APP_PORT}`);
      if (callback) {
        callback();
      }
    });
   }
}

// for development.
function startWebpackAppServer(callback) {
  // Serve the Relay app
  const compiler = webpack(require('./webpack.dev.config.js'));
  devServer = new WebpackDevServer(compiler, {
    contentBase: '/client/',
    publicPath: '/',
    stats: 'errors-only'
  });
  // Serve static resources
  devServer.use('/', express.static(__dirname + '/client/static'));
  devServer.use('/', express.static(__dirname + '/client/build'));

  devServer.listen(WEBPACK_PORT, () => {
    console.log(`Dev server is now running on http://localhost:${WEBPACK_PORT}`);
    if (callback) {
      callback();
    }
  });
}


function startServer(callback) {
  if (appServer) {
    appServer.close();
  }
  if (devServer) {
    devServer.close();
  }
  if (redirectServer) {
    redirectServer.close();
  }
  // Compile the schema
  exec('npm run update-schema', (error, stdout) => {
    if (error) {
      console.log(error);
      return;
    }
    startExpressAppServer(function () {
      if (process.env.NODE_ENV !== 'production') {
        startWebpackAppServer(callback);    
      } else {
        if (callback) {
          callback();
        }
      }
    });
  });
}

if (process.env.NODE_ENV !== 'production') {
  const watcher = chokidar.watch('./data/{database,schema}.js');
  watcher.on('change', path => {
    console.log(`\`${path}\` changed. Restarting.`);
    startServer(() =>
      console.log('Restart your browser to use the updated schema.')
    );
  });
}

function setupDatabase(callback) {
  db.connect(config[config.database]);
  if (process.env.NODE_ENV === 'production') {
      // do not sync
			callback();
  } else {
    // make sync really explicity we don't want this happening by accident
    if (process.env.sync_db === 'true') {
      console.log('syncing db');
      db.sync(function (err) {
				return callback(err);
      });
    } else {
			callback();
		}
  }
}

setupDatabase(function (err) {
	if (err) {
		throw err;
	}
	startServer(function () {
		console.log('server started');
	});
});

