const path=require("path");
const webpack=require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');//独立打包css模块;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩CSS模块;
entry={};
entry["main"]="./src/main.jsx";
entry[0]="webpack-dev-server/client?http://localhost:3000";
entry[1]="webpack/hot/only-dev-server";
module.exports={
    entry:entry,
    output:{
        path:path.join(__dirname,"dist"), // 将构建打包输出的app.js放到build目录下
        // 可以对构建输出的app.js进行二次定制化命名，比如加时间戳等
        filename:"[name].js",
        // webpack构建输出的临时文件存放到内存中，而且是以publicPath作为相对路径。
        // publicPath并不会影响输出目录
        // 此外，如果指定路径下已经存在了相同文件，webpack会优先使用内存的临时文件
        publicPath:"/static/",
        chunkFilename: '[name].[chunkhash:5].js'
    },
    module:{
        rules:[
            {
                test: /\.jsx|js$/,
                exclude: /(node_modules)/,
                use:[
                    {
                        loader:"babel-loader"
                    }
                ]
            },
            {
                test: /\.css|scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader:"css-loader" ,
                            options:{
                                importLoaders: 1
                            }
                        },
                        "resolve-url-loader",
                        "sass-loader?sourceMap",
                        {
                            loader: "postcss-loader", //自动给css添加浏览器兼容前缀
                            options: {
                                sourceMap: true,
                                plugins: function () {
                                    return [
                                        require('autoprefixer')({browsers:["last 40 versions"]})]
                                }
                            }
                        }
                    ],
                    // publicPath: './asset' //修改css中如背景图片的路径引用
                })
            },
            {
                test: /\.png|jpg|gif|svg|jpeg|ico$/,
                use:[{
                    loader : 'url-loader',//加载url-loader 同时安装 file-loader;
                    options:{
                        limit : 5000, //小于5000b的图片文件转base64到css里,当然css文件体积更大;
                        name : 'img/[name].[hash:8].[ext]',//设置最终images路径;
                        query: 'random=' + new Date().getTime()
                    }
                },
                    { //压缩图片(另一个压缩图片：image-webpack-loader) 先压缩再判断是否小于上面的limit再决定是否转base64;
                        loader : 'img-loader?minimize&optimizationLevel=5&progressive=true'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js','.jsx']
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),//热加载
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('development'), //production & development,
                'PUBLIC_PATH': JSON.stringify('http://127.0.0.1')
            }
        }),
        //从js中抽离css,属性disable为true表示禁用此插件并不抽离css，为false表示不禁用此插件，抽离css并打包成单独的css文件
        new ExtractTextPlugin({
            filename: "[name].css",
            disable: false,
            allChunks: true
        }),
        //压缩css（注:因为没有用style-loader打包到js里所以webpack.optimize.UglifyJsPlugin的压缩本身对独立css不管用）;
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,                //正则匹配后缀.css文件;
            cssProcessor: require('cssnano'),            //加载‘cssnano’css优化插件;
            cssProcessorOptions: { discardComments: {removeAll: true } }, //插件设置,删除所有注释;
            canPrint: true                             //设置是否可以向控制台打日志,默认为true;
        }),
    ],
    devtool:"inline-source-map"
};

