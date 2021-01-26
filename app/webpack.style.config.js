const path = require("path");

module.exports = [
  {
    entry: "./src/assets/styles.scss",
    output: {
      // This is necessary for webpack to compile
      // But we never use style-bundle.js
      filename: "ignore-me.js",
      path: path.resolve(__dirname, "assets"),
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "styles.css",
              },
            },
            { loader: "extract-loader" },
            { loader: "css-loader" },
            { loader: "resolve-url-loader" },
            {
              loader: "sass-loader",
              options: {
                // Prefer Dart Sass
                implementation: require("sass"),

                // See https://github.com/webpack-contrib/sass-loader/issues/804
                webpackImporter: false,
                sassOptions: {
                  includePaths: ["./node_modules"],
                },
              },
            },
          ],
        },
        {
          test: /\.(woff2?|ttf|otf|eot|svg)$/,
          exclude: /node_modules/,
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outPath: "fonts/",
          },
        },
      ],
    },
  },
];
