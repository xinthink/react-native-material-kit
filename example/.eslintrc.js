module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error', {
      bracketSpacing: true,
      jsxBracketSameLine: true,
      singleQuote: true,
      trailingComma: 'all', // 'es5'
      printWidth: 120,
    }],
    semi: 'off',
    'react-native/no-inline-styles': 'off',
  },
};
