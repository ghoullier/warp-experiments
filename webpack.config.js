const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WarpifyPlugin = require("@warpjs/webpack-plugin");

module.exports = {
  plugins: [
    new CleanWebpackPlugin(), // clean output for each build
    new HtmlWebpackPlugin({
      template: "src/index.html" // define html template
    }),
    new CopyPlugin([
      { from: "public", to: "." } // copy assets to output
    ]),
    new WarpifyPlugin({
      exclude: [/node_modules/],
      include: [/\.js$/],
      config: {
        project: {
          userId: process.env.WARP_JS_USER_ID, // Go to starbase.warpjs.com to get your User ID
          name: "playwright"
        }
      }
    })
  ]
};
