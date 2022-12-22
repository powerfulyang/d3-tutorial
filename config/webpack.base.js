const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        loader: 'swc-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: { minimize: true },
      },
      {
        test: /\.scss/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '../static/index.html'),
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, '../dist')],
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL || ''),
    }),
  ],
};
