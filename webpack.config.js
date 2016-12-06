var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index"
    },
    output: {
        filename: "assets/js/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.scss/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("assets/css/style.css")
    ],
    devtool: "source-map",
    devServer: {
        hot: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
};