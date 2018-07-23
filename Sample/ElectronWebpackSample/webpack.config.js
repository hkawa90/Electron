const merge = require('webpack-merge');

const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const commonConfig = {
    devtool: 'inline-source-map'
};

const mainConfig = {
    entry: './src/main/index.js',
    output: {
        filename: 'index.js',
        path: path.join(__dirname, './app')
    },
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './src/package.json', to: './package.json'}
          ], { copyUnmodified: true })
    ]
};

const rendererConfig = {
    entry: './src/renderer/index.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './app')
    },
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: false }
                    }
                ]
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/renderer/index.html",
            filename: path.join(__dirname, './app/index.html')
        })
    ]
};

module.exports = env => {
    var production = env.production || false;
    if (production) {
        mainConfig.mode = rendererConfig.mode = 'production';
    } else {
        mainConfig.mode = rendererConfig.mode = 'development';
    }
    return merge(commonConfig, mainConfig, rendererConfig);
}