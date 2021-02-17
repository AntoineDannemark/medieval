const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
    const isEnvDevelopment = env.NODE_ENV === 'development';
    const isEnvProduction = env.NODE_ENV === 'production';

    return {
        entry: paths.appSrc + '/index.js',
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
                    test: /\.css$/,
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
        resolve: { extensions: ['*', '.js', '.jsx'] },
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