let webpack = require("webpack");
let BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = (env, argv) => {
    let mode_env = argv.mode || "development";

    return {
        devtool: "source-map",
        entry: {
            main: "./lib/index",
        },

        output: {
            library: "redux-dynamic-modules-core",
            libraryTarget: "umd",
            filename:
                mode_env === "production"
                    ? "redux-dynamic-modules-core.min.js"
                    : "redux-dynamic-modules-core.js",
            path: __dirname + "/dist/",
        },

        externals: {
            "prop-types": "prop-types",
            react: "react",
            redux: "redux",
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
