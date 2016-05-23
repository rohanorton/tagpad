'use strict';
var path = require('path');
var webpack = require('webpack');
module.exports = {
  devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, "./tagpad.jsx")
  ],
  output: {
    path: path.join(__dirname, "/build/"),
    publicPath: '/build',
    filename: "bundle.js"
  },
  plugins: [
    new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        loaders: ['eslint'],
        // define an include so we check jsut the files we need
        include: ['./components', './tagpad.jsx']
      }
    ],
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      }
    ]
  }
};
