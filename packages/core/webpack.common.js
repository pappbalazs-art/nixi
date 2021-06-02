const path = require('path');

module.exports = {
	entry: {
		main: './src/index.ts'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js',
		libraryTarget: 'this'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: 'ts-loader'
			}
		]
	}
};
