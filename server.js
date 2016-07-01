import chokidar from 'chokidar';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {clean} from 'require-clean';
import {exec} from 'child_process';
import proxy from 'express-http-proxy';
import cookieParser from 'cookie-parser';

const GRAPHQL_PORT = 8080;

let graphQLServer;
let appServer;

let APP_PORT = 3000;

if (process.env.NODE_ENV === 'production') {
  APP_PORT = 80;
}

// for production
function startExpressAppServer(callback) {
  let app = express();

  // can serve these directly.
  app.use('/', express.static(__dirname + '/static'));

  // build the client scripts and server them from the build folder
  app.use('/', express.static(__dirname + '/client'));

  app.use(cookieParser());

  // proxy graphql to the graphql server on the graphql port
  app.use('/graphql', proxy(`http://localhost:${GRAPHQL_PORT}`));

  app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
    if (callback) {
      callback();
    }
  });
}

// for development.
function startWebpackAppServer(callback) {
  // Serve the Relay app
  let webpackConfig = require('./webpack.dev.config.js');
  const compiler = webpack(webpackConfig);
  appServer = new WebpackDevServer(compiler, {
    contentBase: '/client/',
    proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    publicPath: '/',
    stats: 'errors-only'
  });
  appServer.use(cookieParser());

  appServer.use('/login',function(req, res, next) {
    res.cookie('login', 'true' ).send('You are now logged in');
  });
  appServer.use('/logout',function(req, res, next) {
    res.cookie('login' , 'false').send('You are now logged out');
  });

  appServer.use('/getcookie', function(req, res, next) {
    console.log(req.originalUrl); // '/admin/new'
    console.log(req.baseUrl); // '/admin'
    console.log(req.path); // '/new'
    res.send(req.cookies);
  });

  appServer.use('login_page', function (req, res, next) {
    res.send('This is a page where you can login');
  });

  appServer.use('/graphql', function (req, res, next) {
    if (req.cookies.login !== 'true') {
      res.redirect('/login_page');
    } else {
      next();
    }
  });
  // Serve static resources
  appServer.use('/', express.static(__dirname + '/client/static'));
  appServer.use('/', express.static(__dirname + '/client/build'));


  appServer.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
    if (callback) {
      callback();
    }
  });
}

function startGraphQLServer(callback) {
  // Expose a GraphQL endpoint
  clean('./data/schema');
  const {Schema} = require('./data/schema');
  const graphQLApp = express();
  graphQLApp.use('/graphql', graphQLHTTP({
    graphiql: true,
    pretty: true,
    schema: Schema,
  }));
  graphQLServer = graphQLApp.listen(GRAPHQL_PORT, () => {
    console.log(
      `GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`
    );
    if (callback) {
      callback();
    }
  });
}

function startServers(callback) {


  // Shut down the servers
  if (appServer) {
    appServer.listeningApp.close();
  }
  if (graphQLServer) {
    graphQLServer.close();
  }

  // Compile the schema
  exec('npm run update-schema', (error, stdout) => {
    console.log(stdout);
    let doneTasks = 0;
    function handleTaskDone() {
      doneTasks++;
      if (doneTasks === 2 && callback) {
        callback();
      }
    }
    startGraphQLServer(handleTaskDone);

    if (process.env.NODE_ENV === 'production') {
      startExpressAppServer(handleTaskDone);
    } else {
      startWebpackAppServer(handleTaskDone);
    }
  });
}
const watcher = chokidar.watch('./data/{database,schema}.js');
watcher.on('change', path => {
  console.log(`\`${path}\` changed. Restarting.`);
  startServers(() =>
    console.log('Restart your browser to use the updated schema.')
  );
});

const config = require(path.join(process.env.HOME, 'tagpad_config.js'));
const db = require('./data/' + config.database + '.js');

db.define(config[config.database], function (err) {
  if (err) {
    throw err;
  }
  startServers();
});
