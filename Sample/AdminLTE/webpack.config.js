var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
    entry: { main: "./src/main.js" },
    output: {
        path: path.join(__dirname, 'lib'),
        filename: "[name].[chunkhash].js",
        sourceMapFilename: "[name].[chunkhash].map",
    },
    resolve: {
        modules: [
            'node_modules',
            path.join(__dirname, 'src'),
        ],
    },
    plugins: [
        // 1) Extract Pluginを読み込む
        new ExtractTextPlugin("[name].[chunkhash].css"),

        // 2) あわせてHtmlWebpackPluginを使うとHTML上にCSSへのリンクを書き出してくれる
        // Add => <link href="<name.chunkhash>.css" rel="stylesheet"></head>
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body",
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
    ],
    module: {
        loaders: [
            // Extract css files
            {
                // ３）実際にExtractTextPluginでCSSを処理する
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("css-loader")
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?name=/font/[name].[ext]'
            },
            {
                test: /\.(jpg|png)$/,
                loaders: 'url-loader'
            },
        ]
    },
}
module.exports = config;