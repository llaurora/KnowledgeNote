const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 复制静态资源的插件
const TerserPlugin = require('terser-webpack-plugin'); // Js压缩插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 主要用于Css压缩、去重
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 生产打包清空目录下文件
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 包体组成分析
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const webpackCommonConfig = require('./webpack.common.config');

function resolve(dir) {
  return path.resolve(process.cwd(), dir);
}

const wepackBuildConfig = {
  output: {
    // path.resolve()方法可以将多个路径解析为一个规范化的绝对路径;
    // path.join()方法可以连接任意多个路径字符串;
    // process.cwd() 是当前执行node命令时候的文件夹地址 ——工作目录，保证了文件在不同的目录下执行时，路径始终不变;
    // __dirname 是被执行的js文件的地址 ——文件所在目录
    path: path.resolve(process.cwd(), 'build'),
    publicPath: './',
    // contenthash替代chunhash或者hash解决css模块修改后，js哈希值变动
    filename: 'js/[name].[contenthash:12].js',
    chunkFilename: 'js/[id].[contenthash:12].js',
  },
  optimization: {
    minimize: true, // 生产环境production下，默认为true，告诉webpack使用TerserPlugin压缩模块
    minimizer: [
      new TerserPlugin({
        cache: true, // 启用文件缓存，默认为false
        parallel: true, // 使用多进程并行运行来提高构建速度,默认并发运行数：os.cpus().length - 1,不设置parallel默认为false
        sourceMap: true,
        terserOptions: {
          warnings: false,
          output: {
            comments: false, // 不移除代码注释
          },
          compress: {
            drop_console: true, // 移除console
            drop_debugger: true, // 移除debugger
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g,
        cssProcessor: cssnano, // 加载‘cssnano’css优化插件;
        cssProcessorOptions: {
          autoprefixer: false,
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true, // 移除注释
              },
              normalizeUnicode: false, // 建议设置为false,否则在使用unicode-range的时候会产生乱
            },
          ],
        },
      }),
    ],
    runtimeChunk: true,
    splitChunks: {
      chunks: 'async', // async针对异步加载的chunk做切割，initial针对初始chunk，all针对所有chunk
      minSize: 30000, // 我们切割完要生成的新chunk(压缩前)要>30kb，否则不生成新chunk
      minChunks: 1, // 共享该module的最小chunk数
      maxAsyncRequests: 5, // 最多有5个异步加载请求该module
      maxInitialRequests: 3, // 初始化的时候最多有3个请求该module
      automaticNameDelimiter: '~', // 名字中间的间隔符
      name: true,
      cacheGroups: {
        // 我们要切割成的每一个新chunk就是一个cache group
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // name: 'vendor',
          // chunks: 'initial',
          // reuseExistingChunk: false,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        styles: {
          name: 'styles',
          test: /\.s?css$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx|js$/,
        include: [resolve('src')], // 限制范围，提高打包速度
        use: [
          {
            loader: 'eslint-loader',
            options: {
              /*
              生产环境fix设置为false，如果为true在生产打包过程中会尽可能修复发现的错误(比如给变量赋值=号后面没与变量值用空格隔开(不符合设置的
              space-infix-ops规则)会在打包过程中被修复)，但由于已经在控制台报告了错误，会以为还存在不符合eslint规范的代码(虽然尽可能的修复而使其
              符合eslint规范了，但是也不一定都修复得符合eslint规范了，建议在生产打包之前回顾下代码是否符合eslint规范)
               */
              quiet: true, // 设置为true，会忽略eslint检测出来为警告(warn)的，仅仅处理和报告检测出来为错误的(error)
              fix: true, // 设置为true时，eslint会在源文件中尽可能多的修复发现的错误，不能修复的错误才会被报告出来
              formatter: eslintFriendlyFormatter, // 指定错误报告的格式规范
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      // 可视化包块分析
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8080,
      reportFilename: 'analyse.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      logLevel: 'info',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    new CopyWebpackPlugin([{ from: 'mock/**/*', to: './', ignore: ['*.js'] }]),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './public/indexModal.html'),
      filename: path.resolve(process.cwd(), './build/Index.html'),
      inject: true, // true或者body：所有JavaScript资源插入到body元素的底部
      chunks: 'all', // 允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的thunk注入到模板中
      /*
        hash:true|false，是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值，添加hash形式如下所示：
        html <script type="text/javascript" src="common.js?a3e1396b501cdd9041be"></script>
       */
      hash: true, // 给生成的js文件一个独特的 hash 值
      chunksSortMode: 'none',
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new CompressionPlugin({
      // 开启gizp压缩，减小文件体积，传输速度更快
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  devtool: 'sourceMap',
};

module.exports = webpackMerge(webpackCommonConfig, wepackBuildConfig);
