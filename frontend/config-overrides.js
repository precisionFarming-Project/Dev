const path = require('path');

module.exports = {
  webpack: (config) => {
    // Add polyfills to Webpack
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    };
    return config;
  },
};
