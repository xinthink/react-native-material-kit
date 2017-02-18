module.exports = {
  parser: 'babel-eslint',     // https://github.com/babel/babel-eslint
  extends: 'airbnb',          // https://github.com/airbnb/javascript
  'plugins': [
    'react',                  // https://github.com/yannickcr/eslint-plugin-react
  ],
  rules: {
    'no-underscore-dangle': 'off',
    'no-mixed-operators': ['error', { allowSamePrecedence: true }],
    // 'no-duplicate-imports': 'warn',

    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'warn',
    'import/no-unresolved': 'warn',

    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 'warn',
    'react/require-default-props': 'warn',
  },
};
