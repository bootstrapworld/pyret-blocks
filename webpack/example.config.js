var _ = require('lodash');
var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CircularDependencyPlugin = require('circular-dependency-plugin')


var baseConfig = require('./base.config.js')();

// this is the config for generating the files needed to run the examples.
module.exports = function(env, argv) {
  // Display bundle size when building for production
  if(argv['mode'] == 'production') { 
    console.log(process);
    baseConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static', 
      openAnalyzer: !('TRAVIS' in process.env && 'CI' in process.env)
    }));
  }

  return _.extend({}, baseConfig, {
    devtool: 'cheap-module-source-map',
    entry: {
      "new-pyret-editor-example": './example/new-pyret-editor-example.js'
    },
    module: _.extend({}, baseConfig.module, {
      rules: baseConfig.module.rules.concat([
        { test: /\.arr$/, use: 'raw-loader' }
      ])
    }),
    plugins: baseConfig.plugins.concat([
      new HtmlWebpackPlugin({
        filename: 'new-pyret-editor.html',
        template: 'example/new-pyret-editor.html',
        inject: 'body',
        chunks: ['commons','new-pyret-editor-example'],
      }),
      new webpack.IgnorePlugin(/analyzer|compiler|modules\.js/, /node_modules/),
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      })
    ]),
    optimization: {
      minimize: argv['mode'] == 'production',
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            enforce: true
          }
        }
      }
    },
    devServer: {
      hot: true,
      inline: true,
      progress: true,
      contentBase: path.join(__dirname, '..', 'example')
    }
  });
}
