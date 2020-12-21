const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const htmlWebpackPlugin = require('html-webpack-plugin');

const devConfig = {
    mode: 'development',
    entry: path.join(__dirname, "./../web/yxs/yxs.js"),
    output: {
        path: path.join(__dirname, "./../web"),
        filename: "yxsBundle.js"
    },
    plugins: [
        new htmlWebpackPlugin({
          template: path.join(__dirname, './../web/viewer.html'),
          filename: 'index.html'
        })
      ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader?modules'],
            },
            {
                test: /\.less$/,
                use:['style-loader','css-loader','less-loader']
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, './../web'),
        compress: true,
        port: 3002,
        host:'localhost',
        open: true, // 自动打开浏览器
        proxy:{
            '/api': {
                target: 'https://cigrs-dev.cigdata.cn',
                pathRewrite: { '^/api' : '' },
                secure: false,
                changeOrigin: true
            }
        }
    },
};
module.exports = merge(devConfig, baseConfig); // 将baseConfig和devConfig合并为一个配置