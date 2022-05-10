require('@babel/register');
import express from 'express';
import path from 'path';
const server = express();

const isProd = process.env.NODE_ENV==='production'
if (!isProd) {
    const webpack = require('webpack');
    const config = require('../../config/webpack.dev');
    const compiler = webpack(config(process.env));
    const webpackDevMiddleware = require("webpack-dev-middleware")(
        compiler,
        config.devServer
    );
    const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);
        
    server.use(webpackDevMiddleware);
    server.use(webpackHotMiddleware);
}
const staticMiddleware = express.static('dist');
server.use(staticMiddleware)

const PORT = process.env.PORT || 3111;
server.listen(PORT, ()=> {
    console.log('server running on',  PORT);
})