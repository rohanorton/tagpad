import chokidar from 'chokidar';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import { graphql } from 'graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {clean} from 'require-clean';
import {exec} from 'child_process';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import bodyParser from 'body-parser';
import session from 'express-session';
var LocalStrategy = require('passport-local').Strategy;

const GRAPHQL_PORT = 8080;

let graphQLServer;
let appServer;
let server;

let APP_PORT = 3000;

if (process.env.NODE_ENV === 'production') {
  APP_PORT = 3000;
}

function startExpressAppServer(callback) {
  let app = express();

  clean('./data/schema');
  const {Schema} = require('./data/schema');

  app.use(
    session({ 
      secret: 'secret', 
      cookie: {maxAge: 60000},
      resave: true,
      saveUninitialized: true
    })
  );
   
  app.post('/login', function (req, res) {
    req.session.user = { name: 'a user'};
    req.session.save(function(err) {
      res.redirect('/');
    })
  });

  app.get('/login', function (req, res) {
    res.sendfile('login.html', {root: __dirname })
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

  /*app.use('/', function (req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  });*/

  app.use('/', express.static(__dirname + '/build/static'));
  // build the client scripts and server them from the build folder
  app.use('/', express.static(__dirname + '/build/client'));

  server = app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
    if (callback) {
      callback();
    }
  });
}

function startServer(callback) {
  if (server) {
    server.close();
  }
  // Compile the schema
  exec('npm run update-schema', (error, stdout) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(stdout);
    startExpressAppServer(callback);
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
  startServer();
});
