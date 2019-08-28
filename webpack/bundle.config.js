var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var baseConfig = require('./base.config.js');

// this is the config for a single js file that can be included with a script tag
var configs = [
  _.extend({}, baseConfig(), {
    entry: {
      "PyretLangBlocks": ['./src/languages/pyret/index.js']
    },
    output: {
      path: path.resolve(__dirname, '..', "dist"),
      filename: "[name].js",
      library: ["PyretLangBlocks"]
    },
    plugins: [new webpack.ProvidePlugin({ codemirror: "codemirror" })],
    externals: {
      'codemirror': 'CodeMirror',
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
