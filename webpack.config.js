const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const host = process.env.PG_WP_HOST && process.env.PG_WP_HOST !== '' ? process.env.PG_WP_HOST : '127.0.0.1';
const port = process.env.PG_WP_PORT && process.env.PG_WP_PORT !== '' ? process.env.PG_WP_PORT : '8080';

const devMode = process.env.NODE_ENV === 'development';
const env = devMode ? 'development' : 'production';

const devServerConfig = {
    host,
    hot: true,
    inline: true,
}

module.exports = {
    devtool: 'cheap-module-source-map',
    devServer: devServerConfig,
    entry: {
        polyfill: "babel-polyfill", // Import polyfills first
        app: "./src/index.tsx",
    },
    mode: env,
    output: {
        path: path.resolve('dist/'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.js', '.jsx'],
                },
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.ts', '.tsx'],
                },
                options: {
                    silent: process.argv.indexOf("--json") !== -1,
                    useBabel: true,
                    useCache: true,
                    babelCore: '@babel/core',
                },
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(env),
                'GONDUL_HOST': JSON.stringify(process.env.GONDUL_HOST),
                'GONDUL_USER': JSON.stringify(process.env.GONDUL_USER),
                'GONDUL_PASS': JSON.stringify(process.env.GONDUL_PASS),
                'PG_USE_MOCKED_MESSAGES': JSON.stringify(process.env.PG_USE_MOCKED_MESSAGES),
            }
        }),
        new HtmlWebpackPlugin({
            title: "Pocket Gondul",
            template: "./src/index.html",
        }),
        new MiniCssExtractPlugin({
          filename: `styles/[name].css`
        }),
        new CheckerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
}
