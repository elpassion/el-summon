const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = () => {
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: './src/client/js/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/client/js'),
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpe?g|svg)$/,
          loader: 'file-loader',
          include: path.resolve(__dirname, 'src/client/assets/img'),
          options: {
            name: '[hash].[ext]',
            outputPath: 'img/',
            publicPath: 'img/',
          }
        },
        {
          test: /\.(html)$/,
          loader: 'html-loader',
        },
        {
          test: /\.(woff2?|ttf|otf|eot|svg)$/,
          loader: 'file-loader',
          include: path.resolve(__dirname, 'src/client/assets/fonts'),
          options: {
            name: '[hash].[ext]',
            outputPath: 'fonts/',
            publicPath: 'fonts/',
          }
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new CleanWebpackPlugin(['dist']),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: './src/client/html/index.html',
        filename: 'index.html',
      }),
    ],
  }
};
