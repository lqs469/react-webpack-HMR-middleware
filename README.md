# react-webpack-HMR-middleware

_HMR的引入颇费周折,*一个有价值的参考 [webpack-hmr-3-ways](https://github.com/ahfarmer/webpack-hmr-3-ways)_

在加入中,有很多注意:
- wenpack中文件入口,第一个是webpack_hmr,另一个就是js文件入口,基本是上面规范写法就可以;

  ``` JAVASCRIPTS
    entry: [
      'webpack-hot-middleware/client?path=/__webpack_hmr',
      './client/entry.js'
    ],
  ```

- 在入口处要添加下面的一段,以实现热加载:

  ``` JAVASCRIPTS
    if (module.hot) {
      module.hot.accept()
    }
  ```

- 下面path就是hmr会生成的位置,以及相应的文件名;

  ``` JAVASCRIPTS
    output: {
      path: path.join(__dirname, 'public'),
      publicPath: '/',
      filename: 'bundle.js'
    },
  ```

  建议将html文件放在'public'文件夹下,以方便src的直接引入,
  例如: `<script src='bundle.js'></script>`
- `webpack.config`文件中需要加入以下几个插件,其中官方文档表示第一个插件是webpack 1.0 使用的.

  ``` JAVASCRIPTS
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  ```

- 在webpack.config中加入这个工具,

  ``` JAVASCRIPTS
    devtool: '#source-map',
  ```

  官方的文档对这个工具的解释是: cannot cache SourceMaps for modules and need to regenerate complete SourceMap for the chunk. It's something for production :)
- server部分操作:
  1. 第一步当然需要申明:

    ``` JAVASCRIPTS
      var webpackConfig = require('./webpack.config') // *
      var webpackDevMiddleware = require('webpack-dev-middleware')
      var webpackHotMiddleware = require('webpack-hot-middleware')
    ```

  2. DevMiddlemare部分:

    ``` JAVASCRIPTS
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

    ``` JAVASCRIPTS
      app.use(webpackHotMiddleware(compiler, {
        log: console.log,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
      }))
    ```

    或着什么都不用写入,直接

    ``` JAVASCRIPTS
      app.use(webpackHotMiddleware(compiler))
    ```
