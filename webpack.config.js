const path = require('path');
const {
  getWebpackDevServerConfig,
} = require('codemirror-blocks/lib/toolkit/webpack');

const devServerConfig = getWebpackDevServerConfig({
  context: path.resolve(__dirname, 'example'),
  entry: './editor-example.js',
});

devServerConfig.module.rules.push({ test: /\.arr$/, use: 'raw-loader' });

const bundleConfigs = require('./webpack/bundle.config');

module.exports = [
  devServerConfig, 
  ...bundleConfigs
];
