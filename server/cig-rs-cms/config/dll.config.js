const webpack = require('webpack')

const path = require('path')

const env = process.env.NODE_ENV
const mode = env === 'development' ? 'development' : 'production'

const vendors = {
  react: [
    'react',
    'react-dom',
    'react-router',
    'react-router-dom',
  ],
  tools: [
    'axios',
    'axios-extra',
  ],
}

module.exports = {
  performance: {
    hints: false,
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
  mode,
  entry: { ...vendors },
  output: {
    path: path.resolve(__dirname, '../asset/library'),
    filename: '[name].js',
    library: '[name]',
  },
  devtool: 'hidden-source-map',
  plugins: [
    new webpack.DllPlugin({
      path: './config/[name]Fest.json',
      name: '[name]',
      context: __dirname,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
      },
    }),
  ],
}
