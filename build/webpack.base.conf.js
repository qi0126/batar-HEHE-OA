var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    context: path.resolve(__dirname, "../"),

    entry: {
        app: ['babel-polyfill', './src/main.js']
    },

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'static/js/[name].[hash].bundle.js',
        publicPath: '/',
    },

    externals: {
        // jquery: 'jQuery',
    },

    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'loaders')
        ]
    },

    resolve: {
        extensions: ['.', '.ts', '.js', '.json', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, '../src'),
            'static': path.resolve(__dirname, '../static'),
        },
        mainFiles: ["index"],
        modules: ["node_modules"],
    },

    module: {
        rules: [{
                test: /\.vue$/,
                exclude: [/node-modules/],
                use: [{
                        loader: 'thread-loader'
                    },
                    {
                        loader: 'cache-loader'
                    },
                    {
                        loader: 'vue-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: [/node-modules/],
                use: [{
                        loader: 'thread-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            cacheDirectory: true
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: [{
                        loader: 'thread-loader'
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/],
                            transpileOnly: true,
                            experimentalWatchApi: true,
                        }
                    }
                ]

            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: 'static/img/[name].[hash:7].[ext]',
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: 'static/fonts/[name].[hash:7].[ext]',
                    }
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:7].[ext]',
                    }
                }]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'index.html',
            inject: true,
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*']
        }]),
    ],

    // 设置不支持node环境运行
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
};