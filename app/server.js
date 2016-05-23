var express = require('express');
var app = express();
var path = require('path');

// configure webpack
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

var compiler = webpack(webpackConfig);

var middleware = webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  hot: true
});

app.use(middleware);

app.use(express.static(__dirname + '/static'));

app.get('/items.json', function (req, res) {
  res.sendFile(path.join(__dirname, 'items.json'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, '0.0.0.0', function () {
  console.log('Example app listening on port 3000!');
});

