const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./base.config.js')();

// this is the config for generating the files needed to run the examples.
module.exports = function(env, argv) {

  return Object.assign({}, baseConfig, {
    devtool: 'cheap-module-source-map',
    entry: {
      "editor-example": './example/editor-example.js'
    },
    module: Object.assign({}, baseConfig.module, {
      rules: baseConfig.module.rules.concat([
        { test: /\.arr$/, use: 'raw-loader' }
      ])
    }),
    plugins: baseConfig.plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        filename: 'editor.html',
        template: 'example/editor.html',
        inject: 'body',
        chunks: ['commons','editor-example'],
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
