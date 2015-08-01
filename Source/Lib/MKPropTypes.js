//
// Common PropTypes definition
//
// Created by ywu on 15/7/16.
//
const { PropTypes, Text } = require('react-native');

// -----------
// ## Common data types

// <secion id="dimen">Dimension</secton>
const dimen = PropTypes.objectOf({
  width: PropTypes.number,
  height: PropTypes.number,
});

// <secion id="aniTimingFunc">Animation timing function</secton>
const aniTimingFunc = PropTypes.oneOf([
  'linear',
  'easeIn',
  'easeOut',
]);

// <secion id="insets">Insets</secton>
const insets = PropTypes.objectOf({
  top: PropTypes.number,
  left: PropTypes.number,
  bottom: PropTypes.number,
  right: PropTypes.number,
});

// <secion id="font">Font</secton>
const font = PropTypes.objectOf({
  color: PropTypes.string,
  fontSize: PropTypes.number,
  fontWeight: Text.propTypes.style.fontWeight,
  fontStyle: Text.propTypes.style.fontStyle,
  fontFamily: PropTypes.string,
});


// -----------
// ## Common PropTypes

// <secion id="mkLayerPropTypes">MKLayer PropTypes</secton>
const mkLayerPropTypes = {
  // FIXME naming conflicts with built-in properties, such as shadowOffset
  // lead to runtime warning: Failed propType: typeChecker is not a function Check the render method of xxx
  shadowColor: PropTypes.string,
  shadowOffset: dimen,
  shadowOpacity: PropTypes.number,
  shadowRadius: PropTypes.number,
  shadowPathEnabled: PropTypes.bool,

  cornerRadius: PropTypes.number,
  maskEnabled: PropTypes.bool,
  rippleEnabled: PropTypes.bool,
  backgroundColor: PropTypes.string,
  backgroundLayerColor: PropTypes.string,
  backgroundLayerCornerRadius: PropTypes.number,
  backgroundAniEnabled: PropTypes.bool,
  ripplePercent: PropTypes.number,
  rippleLayerColor: PropTypes.string,
  rippleAniTimingFunction: aniTimingFunc,
  rippleLocation: PropTypes.oneOf([
    'tapLocation',
    'center',
    'left',
    'right',
  ]),
};


// ## Public interface
exports.dimen = dimen;
exports.aniTimingFunc = aniTimingFunc;
exports.insets = insets;
exports.font = font;
exports.mkLayerPropTypes = mkLayerPropTypes;
