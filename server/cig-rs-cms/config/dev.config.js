const ip = require('ip')
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintWebpackPlugin = require('stylelint-webpack-plugin')

const ReactManiFest = require('./reactFest.json')
const ToolsManiFest = require('./toolsFest.json')

const env = process.env.NODE_ENV
const cfg = require('./app.js')

const prod = env === 'production'

module.exports = {
  stats: 'errors-only',
  target: 'web',
  mode: prod ? 'production' : 'development',
  entry: {
    app: ['./client/client.tsx'],
  },
  output: {
    path: path.resolve(__dirname, '../asset'),
    filename: 'script/[name].js',
    chunkFilename: 'script/[name].[chunkhash:5].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current',
                      browsers: [
                        'last 2 versions',
                        'ie >= 10',
                      ],
                    },
                  },
                ],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-function-bind',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-transform-runtime',
              ],
            },
          }, {
            loader: 'eslint-loader',
          },
        ],
      }, {
        test: /\.jsx?$/,
        use: 'react-hot-loader/webpack',
        include: /node_modules/,
      }, {
        test: /\.css$/,
        use: [
          'css-hot-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader?importLoaders=1',
            options: {
              sourceMap: false,
            },
          },
        ],
      }, {
        test: /\.(png|jpg|gif|md)$/,
        use: ['file-loader?limit=8192&name=image/[md5:hash:base64:10].[ext]'],
      },
    ],
  },
  devtool: !prod ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
  // IE 11 不支持 eval 模式
  // devtool: !prod ? 'cheap-module-source-map' : 'cheap-module-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.jpg', '.jpeg', '.png', '.gif', '.svg'],
    alias: {
      tool: path.resolve(__dirname, '../client/tool'),
      page: path.resolve(__dirname, '../client/page'),
      config: path.resolve(__dirname, '../client/config'),
      component: path.resolve(__dirname, '../client/component'),
      container: path.resolve(__dirname, '../client/container'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: ReactManiFest,
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: ToolsManiFest,
    }),
    // new StylelintWebpackPlugin({
    //   context: 'client',
    //   files: '**/style.ts',
    //   emitErrors: true,
    //   configFile: '.stylelintrc.js',
    //   failOnError: false,
    //   quiet: false,
    // }),
    // Scope Hoisting(作用域提升)
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 打印更新的模块路径
    new webpack.NamedModulesPlugin(),
    // moment 时区 只保留 zh-cn
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-cn/,
    ),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(),
    ],
    noEmitOnErrors: prod,
  },
}
