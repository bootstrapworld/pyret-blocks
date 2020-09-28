var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var baseConfig = require('./base.config.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// this is the config for a single js file that can be included with a script tag
var configs = [
  _.extend({}, baseConfig(), {
    entry: {
      "CodeMirrorBlocks": ['./src/languages/pyret/index.js']
    },
    output: {
      path: path.resolve(__dirname, '..', "dist"),
      filename: "[name].js",
      library: ["CodeMirrorBlocks"]
    },
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', 
        reportFilename: "bundle-sizes.html",
        generateStatsFile: true,
        openAnalyzer: false,
      }),
    ],
    externals: {
      'codemirror': 'CodeMirror',
      'codemirror/addon/search/search' : 'codemirror',
      'codemirror/addon/search/searchcursor' : 'codemirror',
    }
  })
];

configs = configs.concat(
  configs.map(function(config) {
    return _.merge({}, config, {
      output: {
        filename: "[name]-min.js"
      }
    });
  })
);

configs.push(
  _.extend({}, baseConfig({extractCSS:true}), {
    entry: {
      "blocks": './src/languages/pyret/style.less'
    },
    output: {
      path: path.resolve(__dirname, '..', "dist"),
      filename: "[name].css"
    },
  })
);
module.exports = configs;