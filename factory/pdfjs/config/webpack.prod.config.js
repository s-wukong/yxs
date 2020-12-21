const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 单独打包css文件

const prodConfig = {
    mode: 'production',
    entry: path.join(__dirname, "./../web/yxs/yxs.js"),
    output: {
        path: path.join(__dirname, "./../web/"),
        filename: "yxsBundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader?modules'],
                // use: [{loader:MiniCssExtractPlugin.loader},'css-loader?modules'],
            },
            {
                test: /\.less$/,
                use:['style-loader','css-loader','less-loader'],
                // use:[{loader:MiniCssExtractPlugin.loader},'css-loader','less-loader']
            }
        ]
    }
};

module.exports = merge(prodConfig, baseConfig); // 将baseConfig和prodConfig合并为一个配置