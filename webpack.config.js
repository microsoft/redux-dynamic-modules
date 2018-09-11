let webpack = require("webpack");
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {

    let mode_env = argv.mode || 'development';

    return {
        devtool: 'source-map',
        entry: {
            main: './lib/index'
        },

        output: {
            filename: mode_env === "production" ? "react-redux-modules.min.js" : "react-redux-modules.js",
            path: __dirname + "/dist/"
        },

        externals: {
            "react": "react",
            "redux": "redux",
            "react-redux": "react-redux",
            "redux-saga": "redux-saga"
        },
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: `react-redux-module.stats.html`,
                openAnalyzer: false
            })
        ]
    };
};