const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

const DEV = process.env.NODE_ENV === 'development'

const commonConfig = {

  // 模式: 告诉 webpack 使用相应模式的内置优化
  // mode: 'production/development',

  // 入口
  entry: {
    index: ['babel-polyfill', './src/index.js'],
  },

  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
  },

  // 模块Loader
  module: {
    rules: [
      // 处理 js|jsx 文件
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],  
            plugins: ['@babel/plugin-syntax-dynamic-import', ['@babel/plugin-proposal-decorators', {legacy: true}], ['@babel/plugin-proposal-class-properties', {loose: true}]],
          },
        },
      },
      // 处理 css|scss 文件
      {
        test: /\.styl$/,
        use: [
          DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ],
        include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      // 处理 html
      {
        test: /\.html$/,
        use: [
          'raw-loader',
        ],
      },
      // 处理图片
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        use: [
          {loader: 'url-loader', options: {limit: 8192}},
        ],
      },
      // 处理字体
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },

  // 插件:是一个具有apply属性的JavaScript对象, apply属性会被webpack compiler调用
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}

const developmentConfig = {
  output: {
    filename: 'js/[name].bundle.js',
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 5000,
    hot: true,
    clientLogLevel: 'none',
    host: '0.0.0.0',
    useLocalIp: true,
    overlay: true,
    stats: 'errors-only',
    open: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
}

const productionConfig = {
  output: {
    filename: 'js/[name].bundle.js?[chunkhash:5]',
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        html5: true,
      },
    }),
    new UglifyJsPlugin({
      exclude: /node_modules/,
      uglifyOptions: {
        Compress: {
          // 删除`console`语句
          drop_console: true,
        },
      },
    }),
    new webpack.HashedModuleIdsPlugin({
      hashFunction: 'sha256',
      hashDigest: 'hex',
      hashDigestLength: 20,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css?[md5:contenthash:hex:5]',
      allChunks: true,
    }),
  ],
  // stats: 'errors-only',
  // 代码分离(默认会有)
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}

if (DEV) {
  module.exports = webpackMerge(commonConfig, developmentConfig)
} else {
  module.exports = webpackMerge(commonConfig, productionConfig)
}
