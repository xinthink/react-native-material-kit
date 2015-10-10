// Utilities
//
// Created by ywu on 15/7/18.
//

const {
  PixelRatio,
  TouchableWithoutFeedback,
  Platform,
} = require('react-native');

const tinycolor = require('tinycolor2');


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
function parseColor(color) {
  if (!color || typeof color === 'number') {
    return color;
  } else if (color instanceof Array) {
    return color.map(parseColor);
  } else {
    var hexString = tinycolor(color).toHex8();
    var colorInt = parseInt(hexString, 16);
    if (Platform.OS === 'android') {
      // Android use 32 bit *signed* integer to represent the color
      // We utilize the fact that bitwise operations in JS also operates on
      // signed 32 bit integers, so that we can use those to convert from
      // *unsiged* to *signed* 32bit int that way.
      colorInt = colorInt | 0x0;
    }
    return colorInt;
  }
}


// ## Public interface
exports.mergeIntoFast = mergeIntoFast;
exports.toPixels = toPixels;
exports.toDips = toDips;
exports.convertCoordinate = convertCoordinate;
exports.getFontSize = getFontSize;
exports.extractProps = extractProps;
exports.extractTouchableProps = extractTouchableProps;
exports.parseColor = parseColor;
