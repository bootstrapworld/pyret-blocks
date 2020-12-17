const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./base.config.js')();

// this is the config for generating the files needed to run the examples.
module.exports = function(env, argv) {

  return Object.assign({}, baseConfig, {
    devtool: 'cheap-module-source-map',
    entry: {
      "new-pyret-editor-example": './example/new-pyret-editor-example.js'
    },
    module: Object.assign({}, baseConfig.module, {
      rules: baseConfig.module.rules.concat([
        { test: /\.arr$/, use: 'raw-loader' }
      ])
    }),
    plugins: baseConfig.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        filename: 'new-pyret-editor.html',
        template: 'example/new-pyret-editor.html',
        inject: 'body',
        chunks: ['commons','new-pyret-editor-example'],
      }),
      // see https://stackoverflow.com/a/64553486/12026982
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ]),
    optimization: {
      minimize: false,
      splitChunks: false
    },
    devServer: {
      hot: true,
      inline: true,
      progress: true,
      contentBase: path.join(__dirname, '..', 'example')
    }
  });
}
