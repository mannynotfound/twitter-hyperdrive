import AssetsPlugin from 'assets-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'

const DEBUG = process.env.NODE_ENV !== 'production'

export default {
  entry: DEBUG ? ['webpack-hot-middleware/client', './index.js'] : './index.js',
  context: path.resolve(__dirname, './client'),
  output: {
    filename: `[name]${DEBUG ? '' : '.[hash]'}.js`,
    hashDigestLength: 7,
    path: path.resolve(__dirname, './build'),
    publicPath: '/'
  },
  module: {
    preLoaders: DEBUG ? [
      {
        test: /\.js$/,
        loader: 'eslint-loader'
      }
    ] : [],
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', `css?modules&localIdentName=[name]${DEBUG ? '' : '-[hash:base64:4]'}`)
      },
      {
        test: /\.scss$/,
        loader: DEBUG ?
          `style!css!sass?localIdentName=[name]`
          : ExtractTextPlugin.extract('style', `css!sass?localIdentName=[name]-[hash:base64:4]`)
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: DEBUG ? {
          plugins: [['react-transform', {
            transforms: [{
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module']
            }]
          }]]
        } : {}
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.gif$|\.jpe?g$|\.woff|\.eot|\.ttf|\.png$|\.svg$/i,
        loader: `url?limit=10000&name=[name]${DEBUG ? '' : '.[hash:7]'}.[ext]`,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new AssetsPlugin({
      filename: 'assets.json',
      path: 'build'
    }),
    new ExtractTextPlugin(`[name]${DEBUG ? '' : '.[hash]'}.css`),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, './node_modules/html-hyperdrive/vendors') }
    ]),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(DEBUG ? 'development' : 'production')}),
    ...DEBUG ? [
      new webpack.HotModuleReplacementPlugin()
    ] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    ]
  ]
}
