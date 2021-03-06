const { resolve, join } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: join("src", "assets"),
          to: "assets",
          globOptions: {
            ignore: [".gitkeep"],
          },
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      logform$: resolve(__dirname, "node_modules", "logform", "dist", "browser"),
    },
  },
};
