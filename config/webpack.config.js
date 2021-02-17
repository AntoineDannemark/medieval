const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, '../dist');
const APP_DIR = path.resolve(__dirname, '../src')

module.exports = (env) => {
    const isDev = env.NODE_ENV === 'development';
    const isProd = env.NODE_ENV === 'production';

    return {
        entry: APP_DIR + "/index.js",
        mode: isProd ? "production" : isDev && "development",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: { 
                            presets: ["@babel/env"] 
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                }
            ]
        },
        resolve: { extensions: ["*", ".js", ".jsx"] },
        output: {
            filename: "[name]-bundle.js",
            path: BUILD_DIR,
            publicPath: "/",
        },
        devtool: isDev ? "source-map" : false,
        devServer: {
            contentBase: BUILD_DIR
        }
    }
}