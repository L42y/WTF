'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env['NODE_ENV'] === 'production';

const envKeys = [
  'NODE_ENV',
  'LEANCLOUD_REGION',
  'LEANCLOUD_APP_ID',
  'LEANCLOUD_APP_KEY'
];

const envs = envKeys.reduce((envs, key) => {
  const env = process.env[key];

  if (env) {
    return Object.assign({}, envs, {[key]: JSON.stringify(env)});
  } else {
    throw new Error(`Environment variable ${key} shouldn't be ${env}`);
  }
}, {});

const commonLoaders = [{
  test: /\.js$/,
  loader: 'babel-loader',
  exclude: /node_modules/
}, {
  test: /\.jpg$/,
  loader: 'file-loader'
}];

const commonPlugins = [
  new ExtractTextPlugin('web.bundle.css')
];

module.exports = [{
  name: 'client-side',
  cache: true,
  entry: './index.web',
  output: {
    path: './tmp/web',
    filename: 'web.bundle.js',
    publicPath: '/_/'
  },
  module: {
    loaders: commonLoaders.concat([{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css-loader?sourceMap')
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }])
  },
  plugins: commonPlugins.concat([
    new webpack.DefinePlugin({
      'process.env': envs
    })
  ]).concat(isProduction ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin()
  ] : []),
  devtool: 'source-map'
}, {
  name: 'server-side rendering',
  cache: true,
  entry: './index',
  target: 'node',
  output: {
    path: './tmp/server',
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: commonLoaders.concat([{
      test: /\.css$/,
      loader: 'css-loader/locals'
    }])
  },
  plugins: commonPlugins,
  devtool: 'source-map',
  externals: /^[a-z\/\-0-9]+$/
}];
