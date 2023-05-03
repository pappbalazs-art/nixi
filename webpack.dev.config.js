const path = require("path");

const config = env => ({
	mode: "development",
	resolve: {
		modules: ["node_modules"],
		extensions: [".js", ".ts"],
		alias: {
			core: path.resolve(__dirname, "./src/core"),
			platform: path.resolve(__dirname, "./src/platform")
		}
	},
	devtool: "source-map",
	entry: path.resolve(__dirname, "./app/index.ts"),
	output: {
		path: path.resolve(__dirname, "./app"),
		filename: "build.js"
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "./app")
		},
		compress: false,
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true
				},
				exclude: /node_modules/
			}
		]
	},
	plugins: []
});

module.exports = config;
