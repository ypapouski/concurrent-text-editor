const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = 'style-loader';

const config = {
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: './src/app.js',
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, '../../dist'),
        filename: 'index.js'
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: '8080',
        proxy: {
            '/ws': 'http://localhost:8081'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/static/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader']
            }
        ]
    }
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
