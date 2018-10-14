const path = require('path')
const { environment, config } = require('@rails/webpacker')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const { resolve } = require('path')

const phaserModule = path.join(__dirname, '../../node_modules/phaser/')
const phaser = path.join(phaserModule, 'src/phaser.js')
const canvasInput = path.join(__dirname, '../../node_modules/canvasinput/CanvasInput.js')

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  WEBGL_RENDERER: true, 
  CANVAS_RENDERER: true
})

environment.plugins.append('html',
  new HtmlWebpackPlugin({
    inject: 'body',
    alwaysWriteToDisk: true,
    filename: '../index.html',
    template: resolve('app', 'javascript', 'index.html')
  })
)

environment.config.merge({
  resolve:{
    alias: {
      'phaser': phaser,
      'canvasinput': canvasInput,
      '@images': resolve('app/javascript/packs/images'),
      '@maps': resolve('app/javascript/packs/maps'),
      '@language': resolve('app/javascript/packs/lang'),
      '@game': resolve('app/javascript/packs/game'),
      '@styles': resolve('app/javascript/packs/styles'),
      '@pages': resolve('app/javascript/packs/pages'),
      '@components': resolve('app/javascript/packs/components'),
      '@containers': resolve('app/javascript/packs/containers'),
      '@reducers': resolve('app/javascript/packs/reducers'),
      '@actions': resolve('app/javascript/packs/reducers/actions'),
    }
  }
})

environment.loaders.append('md', {
  test: /\.md$/,
  use: [
    {
        loader: "html-loader"
    },
    {
        loader: "markdown-loader",
        options: {
            /* your options here */
        }
    }
  ]
})

environment.loaders.append('ohm', {
  test: /\.ohm$/,
  use: 'raw-loader'
})

environment.loaders.append('tank', {
  test: /\.tank$/,
  use: 'raw-loader'
})

environment.loaders.append('woff2', {
  test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
  loader: "url-loader"
})

environment.loaders.append('woff2', {
  test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
  loader: 'file-loader'
})

environment.loaders.append('phaser', {
  test: /phaser-split\.js$/,
  use: 'expose-loader?Phaser'
})

environment.loaders.append('canvasinput', {
  test: /canvasinput/,
  use: 'exports-loader?CanvasInput'
})

environment.loaders.append('json', {
  test: /\.json$/,
  loader: 'file-loader'
})

environment.config.set('resolve.extensions', ['.js', '.jsx'])

environment.plugins.append('MonacoWebpackPlugin', new MonacoWebpackPlugin())
environment.plugins.append('hardisk', new HtmlWebpackHarddiskPlugin())

environment.plugins.insert('HashedModuleIds', new webpack.HashedModuleIdsPlugin(), { before: 'manifest' })

environment.plugins.append(
  'CommonsChunkVendor',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: (module) => {
      // this assumes your vendor imports exist in the node_modules directory
      return module.context && module.context.indexOf('node_modules') !== -1
    }
  })
)

environment.plugins.append(
  'CommonsChunkManifest',
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  })
)

const webpackConfig = environment.toWebpackConfig()

module.exports = {
  ...webpackConfig,
  target: 'web',
  entry: resolve('app/javascript/packs/application.jsx')
}
