// Utilities
//
// Created by ywu on 15/7/18.
//

const {PixelRatio, TouchableWithoutFeedback} = require('react-native');

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

// Extract the specified props from the given component instance.
// - {`object`} `view` the component instance
// - {`array`|`object`} `propTypes` props definitions
// - {`():boolean`} `filter` predictor to determine which prop should be extracted
function extractProps(view, propTypes, filter) {
  const props = {};
  const propNames = Array.isArray(propTypes) ? propTypes : Object.getOwnPropertyNames(propTypes);

  propNames.forEach((name) => {
    if (!filter || filter(name)) {
      props[name] = view.props[name];
    }
  });

  return props;
}

// Extract Touchable props from the given component instance.
// - {`object`} `view` the component instance
function extractTouchableProps(view) {
  return extractProps(view, TouchableWithoutFeedback.propTypes);
}

// ## Public interface
exports.mergeIntoFast = mergeIntoFast;
exports.toPixels = toPixels;
exports.getFontSize = getFontSize;
exports.extractProps = extractProps;
exports.extractTouchableProps = extractTouchableProps;
