// Utilities
//
// Created by ywu on 15/7/18.
//

const {
  PixelRatio,
  TouchableWithoutFeedback,
  Platform,
  processColor,
} = require('react-native');


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

// Remove keys with null value from the given object
function compact(o) {
  const result = {};
  const propNames = Object.getOwnPropertyNames(o);

  propNames.forEach((k) => {
    const v = o[k];
    if (v) {
      result[k] = v;
    }
  });

  return result;
}

// Convert dips to pixels
const toPixels = PixelRatio.getPixelSizeForLayoutSize.bind(PixelRatio);

// Convert pixels back to dips
function toDips(px) {
  return px / PixelRatio.get();
}

// Convert native coorindate value into unit used in JSX
function convertCoordinate(value) {
  return Platform.OS === 'android' ? toDips(value) : value;
}

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

// Parse stringified color as int
const parseColor = processColor;


// ## Public interface
exports.mergeIntoFast = mergeIntoFast;
exports.compact = compact;
exports.toPixels = toPixels;
exports.toDips = toDips;
exports.convertCoordinate = convertCoordinate;
exports.getFontSize = getFontSize;
exports.extractProps = extractProps;
exports.extractTouchableProps = extractTouchableProps;
exports.parseColor = parseColor;
