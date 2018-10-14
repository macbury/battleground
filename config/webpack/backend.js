process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const { BannerPlugin, IgnorePlugin } = require('webpack')
const { resolve } = require('path')
const NodeExternals = require('webpack-node-externals');
const environment = require('./environment')

const plugins = [
  new IgnorePlugin(/\.(css|less|scss)$/),
  new BannerPlugin({ 
    raw: true, 
    entryOnly: false,
    banner: 'require("source-map-support").install();'
  })
]

module.exports = {
  ...environment,
  devtool: 'sourcemap',
  devServer: {},
  target: 'node',
  entry: [
    'babel-polyfill',
    resolve('sim/index.js')
  ],

  plugins,

  externals: [
    NodeExternals()
  ],

  output: {
    path: resolve('dist/'),
    filename: 'server.js'
  },

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
 }
}
