# react-webpack-HMR-middleware

有三种方式实现热加载:
- 使用 [webpack-dev-server CLI](https://github.com/ahfarmer/webpack-hmr-3-ways/tree/master/server-cli)
- 使用 [webpack-dev-server API](https://github.com/ahfarmer/webpack-hmr-3-ways/tree/master/server-api)
- 使用中间件 [webpack-hot-middleware](https://github.com/ahfarmer/webpack-hmr-3-ways/tree/master/middleware)

关于怎么选择合适的方式, 这有一些简单的解释.
- 尽可能的简化安装, 选择 webpack-dev-server CLI.
- 如果想要使用a task runner类似于grunt 或 gulp, 选择 webpack-dev-server API.
- 如果想要使用你自己的node脚本来运行webpack, 选择 webpack-dev-server API.
- 已经使用express或别的框架了, 选择 webpack-hot-middleware.

前两种方法的配置都较简单.
- 第一种方法[举个栗子](https://github.com/ahfarmer/webpack-hmr-3-ways/blob/master/server-cli/package.json).
- 第二种是webpack自带的热加载功能, 详细操作[举个栗子](https://github.com/ahfarmer/webpack-hmr-3-ways/blob/master/server-api/webpack.config.js).

下面介绍一下第三种使用的热加载方式, 使用中间件：webpack-dev-middleware & webpack-hot-middleware. HMR的引入颇费周折.

在加入中,有很多注意:
- webpack中文件入口,第一个是webpack_hmr,另一个就是js文件入口,基本是上面规范写法就可以;

  ``` JAVASCRIPT
    entry: [
      'webpack-hot-middleware/client?path=/__webpack_hmr',
      './index.js'
    ],
  ```

- 在入口处要添加下面的一段,以实现热加载:

  ``` JAVASCRIPT
    if (module.hot) {
      module.hot.accept()
    }
  ```

- 下面path就是hmr会生成的位置,以及相应的文件名;

  ``` JAVASCRIPT
    output: {
      path: path.join(__dirname, 'public'),
      publicPath: '/',
      filename: 'bundle.js'
    },
  ```

  建议将html文件放在'public'文件夹下,以方便src的直接引入,
  例如: `<script src='bundle.js'></script>`
- `webpack.config`文件中需要加入以下几个插件,其中官方文档表示第一个插件是webpack 1.0 使用的.

  ``` JAVASCRIPT
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  ```

- 在webpack.config中加入这个工具,

  ``` JAVASCRIPT
    devtool: '#source-map',
  ```

  官方的文档对这个工具的解释是: cannot cache SourceMaps for modules and need to regenerate complete SourceMap for the chunk. It's something for production :)
- server部分操作:
  1. 第一步当然需要申明:

    ``` JAVASCRIPT
      var webpackConfig = require('./webpack.config') // *
      var webpackDevMiddleware = require('webpack-dev-middleware')
      var webpackHotMiddleware = require('webpack-hot-middleware')
    ```

  2. DevMiddlemare部分:

    ``` JAVASCRIPT
      const compiler = webpack(webpackConfig)
      const publicPath = webpackConfig.output.publicPath
      app.use(webpackDevMiddleware(compiler, {
        hot: true,
        filename: 'bundle.js',
        publicPath,
        stats: {
          colors: true
        },
        historyApiFallback: true
      }))
    ```

    这个需要注意publicPath一定要对应到路径上,在这里是可以直接写成 `'/'`;
    配置中具体的参数可以[查看官方文档](https://github.com/webpack/webpack-dev-middleware)
  3. HotMiddleware部分

    ``` JAVASCRIPT
      app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
      }))
    ```

    或着什么都不用写入,直接

    ``` JAVASCRIPT
      app.use(webpackHotMiddleware(compiler))
    ```

大致上操作就是这些, 最后推荐一个github上很有价值的参考[webpack-hmr-3-ways](https://github.com/ahfarmer/webpack-hmr-3-ways)_
