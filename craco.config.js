/**
 * CRACO configuration to override webpack config in create-react-app
 * This helps resolve dependency issues without ejecting
 */

const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for babel-loader
      webpackConfig.module.rules[1].oneOf.forEach(rule => {
        if (rule.loader && rule.loader.includes('babel-loader')) {
          // Explicitly set babel-loader path
          rule.loader = require.resolve('babel-loader');
        }
      });

      // Fix for webpack-dev-server & react-refresh-webpack-plugin
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'react-refresh/runtime': require.resolve('react-refresh/runtime'),
        '@pmmmwh/react-refresh-webpack-plugin/client': path.resolve(
          __dirname, 'node_modules', '@pmmmwh', 'react-refresh-webpack-plugin', 'client'
        ),
        '@pmmmwh/react-refresh-webpack-plugin/overlay': path.resolve(
          __dirname, 'node_modules', '@pmmmwh', 'react-refresh-webpack-plugin', 'overlay'
        ),
        'webpack-dev-server/client': path.resolve(
          __dirname, 'node_modules', 'webpack-dev-server', 'client'
        )
      };

      // Ensure React 18 compatibility
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "react": require.resolve("react"),
        "react-dom": require.resolve("react-dom")
      };

      return webpackConfig;
    },
  },
  babel: {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['>0.2%', 'not dead', 'not op_mini all'],
          },
        },
      ],
      '@babel/preset-react',
    ],
  },
  // Disable Fast Refresh to prevent the related error
  devServer: {
    hot: false,
  },
}; 