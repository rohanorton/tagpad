module.exports = {
  entry: "./client/browse.jsx",
  output: {
    path: __dirname + "/client/build",
    publicPath: 'build/',
    filename: "bundle.js"
  },
  module: {
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
