//
// Common PropTypes definition
//
// Created by ywu on 15/7/16.
//
import PropTypes from 'prop-types';
import { Text } from 'react-native';

// -----------
// ## Data types

// <section id="dimen">Dimension</section>
export const dimen = PropTypes.shape({
  height: PropTypes.number,
  width: PropTypes.number,
});

// <section id="font">Font</section>
export const font = PropTypes.shape({
  color: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  // @ts-ignore
  fontStyle: Text.propTypes.style.fontStyle,
  // @ts-ignore
  fontWeight: Text.propTypes.style.fontWeight,
});

// <section id="rippleLocation">Ripple hot-spot location</section>
export const rippleLocation = PropTypes.oneOf([
  'tapLocation',
  'center',
  // 'left',
  // 'right',
]);

// <section id="RippleLocation">Ripple hot-spot location</section>
export type RippleLocation = 'tapLocation' | 'center'
