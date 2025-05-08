const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/test/ComponentTesterRunner.tsx',
  output: {
    filename: 'component-test-bundle.js',
    path: path.resolve(__dirname, 'src/test'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
    fallback: {
      fs: false,
      path: false,
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  // Update node configuration to match webpack 5 requirements
  node: false,
}; 