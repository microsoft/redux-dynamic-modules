let webpack = require("webpack");
let BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = (env, argv) => {
    let mode_env = argv.mode || "development";

    return {
        mode: mode_env,
        devtool: "source-map",
        entry: {
            main: "./lib/index",
        },

        output: {
            library: "redux-dynamic-modules-observable",
            libraryTarget: "umd",
            filename:
                mode_env === "production"
                    ? "redux-dynamic-modules-observable.min.js"
                    : "redux-dynamic-modules-observable.js",
            path: __dirname + "/dist/",
        },

        externals: {
            react: "react",
            redux: "redux",
            "react-redux": "react-redux",
            "redux-observable": "redux-observable",
            "redux-dynamic-modules-core": "redux-dynamic-modules-core",
            rxjs: "rxjs",
            "rxjs/operators": "rxjs/operators",
            "rxjs/observable": "rxjs/observable",
        },
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: `react-redux-module.stats.html`,
                openAnalyzer: false,
            }),
        ],
    };
};
