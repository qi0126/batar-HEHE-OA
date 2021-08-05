var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var common = require('./webpack.base.conf.js');
//  引入环境变量
var config = require('../config')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]
    },
    devServer: {
        contentBase: [path.join(__dirname, "../dist")],
        // host: '0.0.0.0',
        hot: true,
        useLocalIp: true,
        port: '8078',
        clientLogLevel: "warning",
        open: true,
        overlay: {
            warnings: false,
            errors: false,
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.development.envObj
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // webpack跳过编译错误
        new webpack.NoEmitOnErrorsPlugin(),

    ]
});