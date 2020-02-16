const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      'alias': {
        'react-native-material-kit': path.resolve(__dirname, '..'),
      },
    }],
  ],
};
