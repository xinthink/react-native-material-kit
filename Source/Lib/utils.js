// Utilities
//
// Created by ywu on 15/7/18.
//

const {PixelRatio} = require('react-native');

// Add some is-Type methods:
// `isArguments`, `isFunction`, `isString`, `isNumber`, `isDate`, `isRegExp`, `isError`.
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach((name) => {
  exports[`is${name}`] = (obj) => {
    return toString.call(obj) === `[object ${name}]`;
  };
});

// Faster version of `mergeInto`
// that doesn't check its arguments and also
// copies over prototye inherited properties.
function mergeIntoFast(a, b) {
  for (let k in b) {
    a[k] = b[k];
  }
}

// Convert dips to pixels
const toPixels = PixelRatio.getPixelSizeForLayoutSize.bind(PixelRatio);

// Get font size according to the screen density
function getFontSize(sp) {
  return sp * PixelRatio.getFontScale();
}

// ## Public interface
exports.mergeIntoFast = mergeIntoFast;
exports.toPixels = toPixels;
exports.getFontSize = getFontSize;
