const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

module.exports = env => {
    return {
        mode: env.NODE_ENV || 'development',
        devtool: 'inline-source-map',
        entry: {
            main: [
                "@babel/polyfill",
                "webpack-hot-middleware/client?reload=true",
                path.resolve(__dirname,"../src/index.tsx")
            ]
            // vendor: './src/vendor.js',
        },
        output: {
            filename: '[name]-bundle.js',
            path: path.resolve(__dirname, '../dist'),
            publicPath: '/',
            sourceMapFilename: '[file].map'
        },

        module: {
            rules: [
                { test: /\.html$/, use: 'html-loader' },
                {
                    test: /\.(js|ts|tsx|jsx)$/,
                    use: [{ 
                        options: {
                            cacheDirectory: true,
                            plugins: [
                                ['@babel/plugin-proposal-class-properties', {loose: true}],
                                "@babel/plugin-transform-runtime"
                            ]
                        },
                        loader: 'babel-loader'
                    }],
                    exclude: /node_modules/,
                },
                {
                    test: /\.s?css$/,
                    exclude: /\.module.(s(a|c)ss)$/,
                    use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                        sassOptions: {
                            includePaths: ['public/css']
                        },
                        }
                    },
                    ]
                },
                {
                    test: /\.module\.s(a|c)ss$/,
                    use: [
                        'style-loader',
                        { loader: "css-modules-typescript-loader" },
                        {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                exportGlobals: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]' 
                            },
                            sourceMap: true,
                            }
                        },
                        {
                        loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                filename: "index.html"
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                generateStatsFile: true,
                openAnalyzer: true,
                reportFilename: 'webpack-bundle-report.html'
            }),
            new Dotenv({
                safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
                allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
                systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
                silent: true, // hide any errors
                defaults: false, // load '.env.defaults' as the default values if empty.
             }),
             new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false),
                VERSION: JSON.stringify('5fa3b9'),
                BROWSER_SUPPORTS_HTML5: true,
                TWO: '1+1',
                'typeof window': JSON.stringify('object'),
                'process.env.PORT': JSON.stringify(env.PORT)
            })
        ],
        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    vendor: {
                        name: "vendor",
                        chunks: "initial",
                        minChunks: 2
                    }
                }
            },
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        },
        devServer: {
            static: './dist',
            hot: true,
            port: env.PORT,
            historyApiFallback: true
        },
        resolve: {
            extensions: ['.ts', '.tsx', ".js", ".jsx", ".scss"],
            alias: {
                '~': path.resolve(__dirname, '../src')
            }
        }
    }
}