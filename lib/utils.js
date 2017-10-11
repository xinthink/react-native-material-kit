// Utilities
//
// Created by ywu on 15/7/18.
//

import {
  PixelRatio,
  TouchableWithoutFeedback,
  Platform,
  processColor,
  View,
  ViewPropTypes as RNViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import * as R from 'ramda';

// Add some is-Type methods:
// `isArguments`, `isFunction`, `isString`, `isNumber`, `isDate`, `isRegExp`, `isError`.
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach((name) => {
  exports[`is${name}`] = (obj) => toString.call(obj) === `[object ${name}]`;
});

// Remove keys with null value from the given object
const compact = R.reject(R.isNil);

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

const isNotNil = R.compose(R.not, R.isNil);

// Extract the specified props from the given component instance.
// - {`object`} `view` the component instance
// - {`(v,k):boolean`} `filter` predictor to determine which prop should be extracted
function extractPropsBy(view, filter) {
  return R.pickBy(filter, view.props);
}

// Extract the specified props from the given component instance.
// - {`object`} `view` the component instance
// - {`array`|`object`} `propTypes` props definitions
function extractProps(view, propTypes) {
  const propNames = Array.isArray(propTypes) ? propTypes : R.keys(propTypes);
  const filter = (v, k) => R.indexOf(k, propNames) >= 0 && isNotNil(v);
  return R.pickBy(filter, view.props);
}

// Extract Touchable props from the given component instance.
// - {`object`} `view` the component instance
function extractTouchableProps(view) {
  return extractProps(view, {
    ...TouchableWithoutFeedback.propTypes,
    testID: PropTypes.string,
  });
}

const ViewPropTypes = RNViewPropTypes || View.propTypes;

// ## Public interface
export {
  compact,
  toPixels,
  toDips,
  convertCoordinate,
  getFontSize,
  extractProps,
  extractPropsBy,
  extractTouchableProps,
  processColor as parseColor,  // parse stringified color as int
  ViewPropTypes,
};
