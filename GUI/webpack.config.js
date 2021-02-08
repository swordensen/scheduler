const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/assets/index.ts",
  target: "electron-renderer",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "assets"),
  },
};
