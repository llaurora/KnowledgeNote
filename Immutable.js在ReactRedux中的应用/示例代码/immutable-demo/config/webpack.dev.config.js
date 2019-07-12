const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const webpackCommonConfig = require('./webpack.common.config');
const {
  devServerHost,
  devServerPort,
  devMockPort,
} = require('./server.config');
const publicPath = '/';

const wepackDevConfig = {
  devtool: 'cheap-module-eval-source-map', // 调试工具,
  output: {
    // 将构建打包输出的app.js放到build目录下
    // path:path.join(__dirname,'dist'),
    /*
          webpack构建输出的临时文件存放到内存中，而且是以publicPath作为相对路径
          publicPath并不会影响输出目录
          此外，如果指定路径下已经存在了相同文件，webpack会优先使用内存的临时文件
         */
    publicPath,
    // 可以对构建输出的app.js进行二次定制化命名，比如加时间戳等
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
  },
  devServer: {
    // 开发服务器
    /*
          Q:contentBase是什么？
          A:URL的根目录。如果不设定的话，默认指向项目根目录，默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录
          告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要
           提示：webpack-dev-server编译后的文件，都存储在内存中，我们并不能看见的
         */
    // contentBase: false,
    /*
          如果webpack-dev-server的publicPath和output.publicPath不一致，在使用html-webpack-plugin可能会导致引用静态资源失败;
          有一种情况除外，就是output.publicPath是相对路径，这时候可以访问本地资源;
          所以一般情况下都要保证devServer中的publicPath与output.publicPath保持一致。
         */
    publicPath,
    /*
          在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html;
          historyApiFallback 任意的404响应都被替代为index.html。有什么用呢？你现在运行
          npm start，然后打开浏览器，访问http://localhost:8080,然后点击Page1到链接http://localhost:8080/page1，
          然后刷新页面试试。是不是发现刷新后404了。为什么？dist文件夹里面并没有page1.html,当然会404了，所以我们需要配置
          historyApiFallback，让所有的404定位到index.html
         */
    clientLogLevel: 'warning', // 输出日志级别
    historyApiFallback: true, // true不跳转
    quiet: true, // 使用webpack-dev-server，需要设为true，禁止显示devServer的console信息
    // 在页面上全屏输出报错信息
    overlay: {
      warnings: true,
      errors: true,
    },
    compress: true, // 启用gzip压缩
    inline: true, // 设置为true，当源文件改变时会自动刷新页面
    open: true, // 告诉dev-server在服务器启动后打开浏览器
    hot: true, // 模块热更新，取决于HotModuleReplacementPlugin
    host: devServerHost, // 设置默认监听域名，如果省略，默认为“localhost”
    port: devServerPort, // 设置默认监听端口，如果省略，默认为“8080”
    proxy: {
      // 代理配置
      '/devmock': {
        target: 'http://localhost:3000', // 代理配置
        secure: false,
        changeOrigin: true,
        // pathRewrite: { '^/devmock': '' },
      },
    },
  },
  watchOptions: {
    poll: 1000, // 监测修改的时间(ms)
    aggregateTimeout: 400, // 第一个文件更改后，在重建之前添加延迟。这允许webpack将在此时间段内所做的任何其他更改聚合到一个重建中
    ignored: /node_modules/, // 不监测
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),//热加载，当配置了devServer的hot和inline参数之后，webpack会帮我们把HotModuleReplacementPlugin自动添加进来而不用我们再手动添加
    new webpack.DefinePlugin({
      'process.env.NODE_STAGE': JSON.stringify(process.env.NODE_STAGE),
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages:
          process.env.NODE_STAGE === 'mock'
            /* eslint-disable */
            ? [
              `Your mockServer is running here：http://${devServerHost}:${devMockPort}`,
              "-------------------------✂️✂️✂️-----------------------",
              `Your application is running here：http://${devServerHost}:${devServerPort}`,
            ]
            : [
              `Your application is running here：http://${devServerHost}:${devServerPort}`,
            ],
        /* eslint-enable */
      },
    }),
    new HtmlWebpackPlugin({
      title: 'react-redux-app',
      filename: 'index.html', // 文件写入路径，前面的路径与devServer中 contentBase 对应
      template: path.resolve(process.cwd(), './public/indexModal.html'), // 模板文件路径
      inject: true,
    }),
  ],
};

module.exports = webpackMerge(webpackCommonConfig, wepackDevConfig);
