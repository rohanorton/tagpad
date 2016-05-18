module.exports = {
  entry: "./client/tagpad.jsx",
  output: {
    path: __dirname + "/client/build",
    publicPath: 'build/',
    filename: "bundle.js"
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      {
        test: /\.js?$/,
        loaders: ['eslint'],
        // define an include so we check jsut the files we need
        include: './client'
      }
    ],
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
           presets: ["react"]
        }
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      }
    ]
  }
};
