const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
 mode: 'production',
 entry: './src/index.js',
 module: {
   rules: [
     {
       test: /\.(js|jsx)$/,
       exclude: /node_modules/,
       use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
     },
     {
       test: /\.css$/,
       use: [
         "style-loader", 
         {
           loader: "css-loader",
           options: {
             importLoaders: 1,
             modules: true,
           }
         }
       ],
       include: /\.module\.css$/,
     },
     {
       test: /\.css$/,
       use: ["style-loader", "css-loader"],
       exclude: /\.module\.css$/,
     },
     {
       test: /\.(pdf|jpg|png|gif|svg|ico)$/,
       type: 'asset/resource',
     },
     {  
       test: /\.(woff|woff2|eot|ttf|otf)$/,
       type: 'asset/resource',
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
 devServer: {
   static: {
     directory: path.join(__dirname, 'dist')
   }
 },
 performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};