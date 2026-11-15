module.exports = {
  root: true,
  extends: 'expo',
  ignorePatterns: ['/node_modules', '/docs', '/dist', '/.expo'],
  rules: {
    'no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
