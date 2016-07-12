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


let APP_PORT = 3000;
let WEBPACK_PORT = 8080; 

let devServer;
let appServer;

if (process.env.NODE_ENV === 'production') {
  APP_PORT = 80;
}

function startExpressAppServer(callback) {
  var app = express()
  clean('./data/schema');
  const {Schema} = require('./data/schema');

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

  app.post('/login', function (req, res) {
    req.session.user = {name: 'the user'};
    res.cookie('tagpadlogin', 'true', { maxAge: 900000, httpOnly: false });
    res.send('Success');
  });
  app.use('/graphql', graphQLHTTP(function (req, res) {
    if (!req.session.user) {
      throw new Error('Authentication Required'); 
    }
    return {
      graphiql: true,
      pretty: true,
      schema: Schema
    }
  }));
 
  // when in production server these, in dev they are served by webpack dev server. 
  if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(__dirname + '/build/static'));
    app.use('/', express.static(__dirname + '/build/client'));
  } else {
    app.use('/', proxy('http://localhost:' + WEBPACK_PORT + '/'));
  }

  appServer = app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
    if (callback) {
      callback();
    }
  });
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
  // Compile the schema
  exec('npm run update-schema', (error, stdout) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(stdout);
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
const watcher = chokidar.watch('./data/{database,schema}.js');
watcher.on('change', path => {
  console.log(`\`${path}\` changed. Restarting.`);
  startServer(() =>
    console.log('Restart your browser to use the updated schema.')
  );
});

const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
const db = require('./data/' + config.database + '.js');

db.define(config[config.database], function (err) {
  if (err) {
    throw err;
  }
  startServer(function () {
    console.log('server started');
  });
});
