const webpack = require('webpack');

module.exports = {
  style: {
    postOptions: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          process: require.resolve('process/browser'),
          path: require.resolve('path-browserify'),
          zlib: require.resolve('browserify-zlib'),
          stream: require.resolve('stream-browserify'),
          util: require.resolve('util'),
          buffer: require.resolve('buffer'),
          asset: require.resolve('assert'),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ],
    },
  },
};
