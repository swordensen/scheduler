const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { join } = require("path");
module.exports = [
  new ForkTsCheckerWebpackPlugin(),
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
];
