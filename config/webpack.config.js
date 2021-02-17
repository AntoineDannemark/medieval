const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = function(webpackEnv) {
    const isEnvDevelopment = webpackEnv.NODE_ENV === 'development';
    const isEnvProduction = webpackEnv.NODE_ENV === 'production';

    return {
        entry: paths.appIndexJs,
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: { 
                            presets: ['@babel/env'] 
                        }
                    }
                },
                {
                    test: cssRegex,
                    use: [isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
                }
            ]
        },
        plugins: [new HtmlWebpackPlugin(Object.assign(
            {},
            {
              inject: true,
              template: paths.appHtml,
            },          
            isEnvProduction
                ? {
                    minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                    },
                }
                : undefined
        ))]
            .concat(isEnvProduction 
                ? new MiniCssExtractPlugin({
                    filename: 'static/css/[name].[contenthash:8].css',
                    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
                }) : []),        
        resolve: { 
            // TODO consider adding fallback as in CRA ?
            modules: ['node_modules', paths.appNodeModules],
            extensions: paths.moduleFileExtensions
                .map(ext => `.${ext}`),
            plugins: [PnpWebpackPlugin],
        },
        resolveLoader: {
            plugins: [
                PnpWebpackPlugin.moduleLoader(module),
            ],
        },
        output: {
            filename: isEnvProduction 
                ? 'static/js/[name].[contenthash:8].js' 
                : isEnvDevelopment && 'static/js/bundle.js',
            path: paths.appBuild,
            publicPath: '/',
        },
        devtool: isEnvDevelopment ? 'source-map' : false,
        devServer: {
            contentBase: paths.appBuild
        }
    }
}