'use strict';
var path = require('path');
var webpack = require('webpack');
module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve(__dirname, 'client', 'app.js'),
  output: {filename: 'app.js', path: './build/client'},
  plugins: [
    new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      }
    ]
  }
};
