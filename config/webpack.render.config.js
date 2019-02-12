/*
 * @Author: Jacky.LiangXiang
 * @Date: 2019-01-24 21:16:44
 * @Last Modified by: Jacky.LiangXiang
 * @Last Modified time: 2019-01-25 11:49:45
 */
"use strict";

process.env.BABEL_ENV = "renderer";

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
let renderProcessWebpackConfig = {
  entry: {
    render: [path.join(__dirname, "../src/render/index.js")]
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.html$/,
        use: "html-loader"
      },
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: "node-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: "url-loader",
          query: {
            limit: 10000,
            name: "imgs/[name]--[folder].[ext]"
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "media/[name]--[folder].[ext]"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: "url-loader",
          query: {
            limit: 10000,
            name: "fonts/[name]--[folder].[ext]"
          }
        }
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== "production",
    __filename: process.env.NODE_ENV !== "production"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src/render/index.html"),
      filename: "index.html",
      inject: true
    })
  ],
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "../dist/electron")
  },
  resolve: {
    extensions: [".js", ".json", ".css", ".node"]
  },
  target: "electron-renderer"
};

module.exports = renderProcessWebpackConfig;
