'use strict';
const path = require('path');
const moduleName = path.basename(__dirname);
const dist = path.resolve(__dirname, '../dist', moduleName);
const webpackConfig = {
    context: __dirname,
    entry: {
        'index': './index.js'
    },
    output: {
        path: dist,
        filename: '[name].[chunkhash].js'
    }
};

module.exports = webpackConfig;