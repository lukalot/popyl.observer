module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find and modify the source-map-loader rule
      const sourceMapRule = webpackConfig.module.rules.find(
        rule => rule.enforce === 'pre' && rule.use && rule.use.some(use => use.loader === 'source-map-loader')
      );

      if (sourceMapRule) {
        sourceMapRule.exclude = [/node_modules\/@mediapipe/];
      }

      return webpackConfig;
    }
  }
}; 