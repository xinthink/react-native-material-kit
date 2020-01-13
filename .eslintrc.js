module.exports = {
  // parser: 'babel-eslint',     // https://github.com/babel/babel-eslint
  // extends: 'airbnb',          // https://github.com/airbnb/javascript
  // 'plugins': [
  //   'react',                  // https://github.com/yannickcr/eslint-plugin-react
  // ],
  // rules: {
  //   'react/prop-types': 1,
  //   // 'no-duplicate-imports': 1,
  //   // 'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  // },
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': ['error', {
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 110,
    }],
    semi: 'off',
    'react-native/no-inline-styles': 'off',
  },
};
