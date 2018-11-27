let webpack = require("webpack");
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
    let mode_env = argv.mode || 'development';

    return {
        mode: mode_env,
        devtool: 'source-map',
        entry: {
            main: './lib/index'
        },

        output: {
            library: "redux-dynamic-modules-thunk",
            libraryTarget: "umd",
            filename: mode_env === "production" ? "redux-dynamic-modules-thunk.min.js" : "redux-dynamic-modules-thunk.js",
            path: __dirname + "/dist/"
        },

        externals: {
            "react": "react",
            "redux": "redux",
            "react-redux": "react-redux",
            "redux-thunk": "redux-thunk",
            "redux-dynamic-modules": "redux-dynamic-modules"
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