/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
// const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  projectRoot: __dirname,
  watchFolders: [ path.resolve(__dirname, '..') ],
  resolver: {
    // blacklistRE: blacklist([
    //   new RegExp(`^${escape(path.resolve(__dirname, '..', 'node_modules'))}\/.*$`),
    // ]),
    // providesModuleNodeModules: [
    //   'react-native',
    //   'react',
    //   'ramda',
    // ],
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => target.hasOwnProperty(name) ?
          target[name] : path.resolve(__dirname, 'node_modules', name)
      },
    ),
  },
};
