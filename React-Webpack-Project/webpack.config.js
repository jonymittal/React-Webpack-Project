
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jp(e*)g|svg|ico|woff(2)?|ttf|woff2|eot)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 80000, // Convert images < 8kb to base64 strings
            name: 'src/[name].[ext]'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico"
    })
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: true,
    host: '192.168.2.85',
    port: 8989,
  },

  watchOptions: {
    poll: true,
    ignored: /node_modules/
  }
};
