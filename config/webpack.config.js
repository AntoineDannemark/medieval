const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = function(webpackEnv) {
    // const isEnvDevelopment = webpackEnv.NODE_ENV === 'development';
    // const isEnvProduction = webpackEnv.NODE_ENV === 'production';
    const isEnvDevelopment = true;
    const isEnvProduction = false;

    // console.log('webpackEnv', webpackEnv)
    // console.log('webpackEnv.NODE_ENV', webpackEnv.NODE_ENV)

    return {
        entry: paths.appIndexJs,
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        module: {
            rules: [
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    include: paths.appSrc,
                    loader: require.resolve('babel-loader'),
                    options: {
                      customize: require.resolve(
                        'babel-preset-react-app/webpack-overrides'
                      ),
                      
                      plugins: [
                        [
                          require.resolve('babel-plugin-named-asset-import'),
                          {
                            loaderMap: {
                              svg: {
                                ReactComponent:
                                  '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                              },
                            },
                          },
                        ],
                      ],
                      cacheDirectory: true,
                      cacheCompression: false,
                      compact: isEnvProduction,
                    },
                    },
                    // Process any JS outside of the app with Babel.
                    // Unlike the application JS, we only compile the standard ES features.
                    {
                        test: /\.(js|mjs)$/,
                        exclude: /@babel(?:\/|\\{1,2})runtime/,
                        loader: require.resolve('babel-loader'),
                        options: {
                        babelrc: false,
                        configFile: false,
                        compact: false,
                        presets: [
                            [
                            require.resolve('babel-preset-react-app/dependencies'),
                            { helpers: true },
                            ],
                        ],
                        cacheDirectory: true,
                        // See #6846 for context on why cacheCompression is disabled
                        cacheCompression: false,
                        
                        // Babel sourcemaps are needed for debugging into node_modules
                        // code.  Without the options below, debuggers like VSCode
                        // show incorrect code and set breakpoints on the wrong lines.
                        sourceMaps: shouldUseSourceMap,
                        inputSourceMap: shouldUseSourceMap,
                        },
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
            contentBase: paths.appBuild,
            hot: true,
        }
    }
}