'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonLoaders = [{
  test: /\.js$/,
  query: {
    presets: ['react', 'es2015', 'stage-0']
  },
  loader: 'babel-loader'
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
    filename: 'web.bundle.js'
  },
  module: {
    loaders: commonLoaders.concat([{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('css-loader?sourceMap')
    }])
  },
  plugins: commonPlugins,
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
