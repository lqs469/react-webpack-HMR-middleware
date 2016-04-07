var path = require('path');
var webpack = require('webpack');

var config = {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr',
    './index.js',
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  devtool: '#source-map',
  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
module.exports = config
