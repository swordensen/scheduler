const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

// rules.push({
//   test: /\.scss$/,
//   use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }],
// });
// rules.push({
//   test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
//   use: [
//     {
//       loader: "file-loader",
//       options: {
//         name: "[name].[ext]",
//         publicPath: "..",
//         context: "src",
//       },
//     },
//   ],
// });
module.exports = {
  // module: {
  //   rules,
  // },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
