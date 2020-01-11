// Utilities
//
// Created by ywu on 15/7/18.
//
import PropTypes from 'prop-types';
import { Component } from 'react';
import { PixelRatio, Platform, processColor, TouchableWithoutFeedback } from 'react-native';

import { compose, indexOf, isNil, keys, not, ObjPred, partial, pickBy, reject } from 'ramda';

// Add some is-Type methods:
function isType(type: string, obj: any): boolean {
  return Object.toString.call(obj) === `[object ${type}]`;
}

export const isArgument = partial(isType, ['Arguments']);
export const isFunction = partial(isType, ['Function']);
export const isString = partial(isType, ['String']);
export const isNumber = partial(isType, ['Number']);
export const isDate = partial(isType, ['Date']);
export const isRegExp = partial(isType, ['RegExp']);
export const isError = partial(isType, ['Error']);

// Remove keys with null value from the given object
const compact = reject(isNil);

const isNotNil = compose(
  not,
  isNil
);

function capitalize(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

// Convert dips to pixels
const toPixels = PixelRatio.getPixelSizeForLayoutSize.bind(PixelRatio);

// Convert pixels back to dips
function toDips(px: number): number {
  return px / PixelRatio.get();
}

// Convert native coordinate value into unit used in JSX
function convertCoordinate(value: number): number {
  return Platform.OS === 'android' ? toDips(value) : value;
}

// Get font size according to the screen density
function getFontSize(sp: number): number {
  return sp * PixelRatio.getFontScale();
}

// Extract the specified props from the given component instance.
// - {`object`} `view` the component instance
// - {`(v,k):boolean`} `filter` predictor to determine which prop should be extracted
function extractPropsBy(view: Component, filter: ObjPred) {
  return pickBy(filter, view.props);
}

// Extract the specified props from the given component instance.
// - {`object`} `view` the component instance
// - {`array`|`object`} `propTypes` props definitions
function extractProps(view: Component, propTypes: object) {
  const propNames = Array.isArray(propTypes) ? propTypes : keys(propTypes);
  const filter: ObjPred = (v, k) => indexOf(k, propNames) >= 0 && isNotNil(v);
  return pickBy(filter, view.props);
}

// Extract Touchable props from the given component instance.
// - {`object`} `view` the component instance
function extractTouchableProps(view: Component) {
  return extractProps(view, {
    // @ts-ignore: View.propTypes
    ...TouchableWithoutFeedback.propTypes,
    testID: PropTypes.string,
  });
}

// ## Public interface
export {
  capitalize,
  compact,
  toPixels,
  toDips,
  convertCoordinate,
  getFontSize,
  extractProps,
  extractPropsBy,
  extractTouchableProps,
  processColor as parseColor, // parse stringified color as int
};
