'use strict';
var path = require('path');
var webpack = require('webpack');
module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, "./client/tagpad.jsx")
  ],
  output: {
    path: path.join(__dirname, "/client/build/"),
    publicPath: '/build',
    filename: "bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      }
    ]
  }
};
