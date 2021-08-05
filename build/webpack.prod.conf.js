var merge = require('webpack-merge');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var common = require('./webpack.base.conf.js');
var TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    performance: {
        hints: 'warning',
        maxEntrypointSize: 250000,
        maxAssetSize: 250000,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
        ],
    },
    mode: 'production',
    devtool: false,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash].css',
        }),
    ],
})


