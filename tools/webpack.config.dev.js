const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const DashboardPlugin = require('webpack-dashboard/plugin');
const baseConfig = require('./webpack.config.base.js');

module.exports = function () {
    return webpackMerge(baseConfig(), {
        plugins: [
            new DashboardPlugin()
        ],
        devServer: {
            contentBase: path.join(__dirname, '../'),
            publicPath: '/dist/',
            port: 7777,
            host: '0.0.0.0',
            inline:true,
            compress:true,
            open: true
        },
        devtool: 'cheap-module-source-map'
    });
};
