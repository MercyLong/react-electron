/*
 * @Author: Jacky.LiangXiang
 * @Date: 2019-01-24 20:37:50
 * @Last Modified by: Jacky.LiangXiang
 * @Last Modified time: 2019-01-24 22:16:43
 */

/**
 * Node Process Webpack Config
 */

const path = require("path");
const webpack = require("webpack");

let mainWebpackConfig = {
  entry: {
    main: path.join(__dirname, "../src/main/index.js")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: "node-loader"
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== "production",
    __filename: process.env.NODE_ENV !== "production"
  },
  output: {
    filename: "main.js",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, "../dist/electron")
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
  resolve: {
    extensions: [".js", ".json", ".node"]
  },
  target: "electron-main"
};

module.exports = mainWebpackConfig;
