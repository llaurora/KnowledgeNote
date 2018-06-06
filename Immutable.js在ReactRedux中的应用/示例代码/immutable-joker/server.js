const webpack=require("webpack");
const WebpackDevServer=require("webpack-dev-server");
const config=require("./webpack.config.debug");
new WebpackDevServer(webpack(config),{
    publicPath:config.output.publicPath,
    hot:true,
    historyApiFallback:true,
	disableHostCheck: true,
    // proxy: {
    //     '/manhour': {
    //         target: 'http://10.112.75.15',//代理配置
    //         secure: false,
    //         changeOrigin: true,
    //         // pathRewrite: {'^/manhour' : ''},
    //     }
    // }
}).listen(3000,"localhost",function (err,result) {
    if(err){
        console.log(err)
    }
    console.log("Listening at localhost:3000")
});
