const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  getWebpackDevServerConfig,
  getWebpackBundleConfig,
} = require('codemirror-blocks/lib/toolkit/webpack');

const devServerConfig = getWebpackDevServerConfig({
  context: path.resolve(__dirname, 'example'),
  entry: './editor-example.js',
});

devServerConfig.module.rules.push({ test: /\.arr$/, use: 'raw-loader' });
devServerConfig.plugins.push(new HtmlWebpackPlugin({
  filename: 'editor.html',
  template: 'editor.html',
  inject: 'body',
}));

const bundleConfigs = require('./webpack/bundle.config');

module.exports = [devServerConfig, 
  ...bundleConfigs
];
