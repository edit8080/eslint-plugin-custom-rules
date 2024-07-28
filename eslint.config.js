const eslintPluginExample = require('./eslint-plugin-custom-rules')

module.exports = {
  files: ['src/**/*.js'],
  plugins: { 'custom-rules': eslintPluginExample },
  rules: {
    'custom-rules/require-tests-for-utils': 'error',
  },
}
