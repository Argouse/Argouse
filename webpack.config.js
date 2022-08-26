const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports={
  plugins: [
    new ESLintPlugin(),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_debugger: true,
          drop_console: true,
          pure_funcs: ["console.log"],
        },
      },
      sourceMap: false,	// config.build.productionSourceMap
      cache: true,		// 启用缓存
      parallel: true,	// 并行任务构建
    }),
  ],
  entry:'./src/index.js',
  output:{
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'

  },
  devServer: { hot: true },
  module: {
    rules: [
      {
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: /node_modules/
        },
    ]
  }
  
}