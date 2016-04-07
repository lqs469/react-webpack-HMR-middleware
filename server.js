var express = require('express')
var webpack = require('webpack')

var path = require('path')

var app = express()

// 1. 申明
var webpackDevMiddleware = require("webpack-dev-middleware")
var webpackHotMiddleware = require("webpack-hot-middleware")
var webpackConfig = require('./webpack.config.js')
var compiler = webpack(webpackConfig)

// 2. Dev部分处理
app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}))

// 3. Hot部分处理
app.use(webpackHotMiddleware(compiler, {
  // 非必要
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000,
}))

app.get('/', function (req, res) {
  res.sendfile('index.html')
})

var server = app.listen(3000, function () {
  console.log('listening at http://localhost:3000')
});
