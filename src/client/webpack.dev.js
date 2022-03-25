const path = require("path");

const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common,{
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname,"../../dist/client")
        },
        hot: true
    }
})