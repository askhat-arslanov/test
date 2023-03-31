const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const resolveApp = (relativePath) => path.resolve(__dirname, relativePath);

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'index.tsx'),
    content: path.resolve(__dirname, 'src/chrome', 'content.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  devtool: 'cheap-module-source-map',
  target: 'web',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin(
        {patterns: [
            { from: "public", to: "public" },
            { from: "manifest.json", to: "." },
          ]
        }
    ),
    new HtmlWebpackPlugin({
        template:  path.resolve(__dirname, 'src/index.html'),
        chunks : ['main'],
    })
    ],
  module: {
    rules: [
        {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf|png)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        },
        {
            test: /\.(jsx|tsx|js|ts)$/,
            include: [
                resolveApp('src'),
                resolveApp('../shared.ui'),
                resolveApp('../shared.constants'),
            ],
            exclude: /node_modules\/(?!@cordless).+/,
            use: {
            loader: 'babel-loader',
            options: {
                    presets: [
                        '@babel/preset-typescript',
                        [
                        '@babel/preset-env',
                        {
                        useBuiltIns: 'entry',
                        corejs: '3.22',
                        },
                    ],
                    '@babel/preset-react',
                    ],
                },
            },
        },
    ],
  },
};
