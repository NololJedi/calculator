const {resolve} = require('path');
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PATHS = {
    output: resolve(__dirname, 'dist/'),
    nodeModules: resolve(__dirname, 'node_modules')
};

module.exports = {
    mode: 'production',
    entry: './js/main.js',
    output: {
        filename: "bundle.js",
        path: PATHS.output,
        publicPath: "./"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'])
    ]
};