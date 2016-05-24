var express = require('express');
var app = express();
var path = require('path');
const db = require('./database/db.js');
const config = require(path.join(process.env.HOME, 'tagpad_config.js'));

import GraphHTTP from 'express-graphql';
import Schema from './database/schema';

function setupWebpack () {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.js');
  var compiler = webpack(webpackConfig);
  var middleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
  });
  app.use(middleware);
}

setupWebpack();

db.define(config.database, function (err) {
  if (err) {
    throw err;
  }
  
  require('./database/addExampleData.js').run();

  app.use(express.static(__dirname + '/client/static'));
  //app.use('/items', require('./controllers/items.js').getRouter());

  app.use('/graphql', GraphHTTP({
    schema: Schema,
    pretty: true,
    graphiql: true
  }));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/index.html'));
  });
  app.listen(3000, '0.0.0.0', function () {
    console.log('Example app listening on port 3000!');
  });
});
