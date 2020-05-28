const { WatchIgnorePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { join } = require("path");

module.exports = {
	entry: "./src/index.ts",
	output: {
		path: join(__dirname, "dist"),
		filename: "[id].[hash:5].js"
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx"]
	},
	devtool: "eval-source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader"
			},
			{
				test: /\.sass$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							modules: true,
							esModule: true
						}
					},
					"sass-loader"
				]
			}
		]
	},
	plugins: [
		new WatchIgnorePlugin([/css\.d\.ts$/]),
		new HtmlWebpackPlugin({ inject: "body", title: "Grapher" })
	]
};
