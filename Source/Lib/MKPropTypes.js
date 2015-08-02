//
// Common PropTypes definition
//
// Created by ywu on 15/7/16.
//
const { PropTypes, Text } = require('react-native');

// -----------
// ## Data types

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
  // FIXME naming conflicts with built-in properties, such as shadowOffset, which lead to a warning:
  //
  //     Failed propType: typeChecker is not a function. Check the render method of ...

  // Shadow style, ok to specify in [RN.View#style](https://facebook.github.io/react-native/docs/view.html#style)
  shadowColor: PropTypes.string,
  shadowOffset: dimen,
  shadowOpacity: PropTypes.number,
  shadowRadius: PropTypes.number,

  // (*Experimental*) Draw shadow under bottom border, avoid shadow under text when there's a translucent background
  shadowPathEnabled: PropTypes.bool,

  // Corner radius, ok to specify as [RN.View#style.borderRadius](https://facebook.github.io/react-native/docs/view.html#style)
  cornerRadius: PropTypes.number,

  // If true, restrict ripple stay inside the bounds, like css `overflow: 'hidden'`
  maskEnabled: PropTypes.bool,

  // Background color, ok to specify in [RN.View#style](https://facebook.github.io/react-native/docs/view.html#style)
  backgroundColor: PropTypes.string,

  // The opacity effect of background, disable it will also disable `maskEnabled`
  backgroundAniEnabled: PropTypes.bool,

  // The translucent mask over ripple layer
  backgroundLayerColor: PropTypes.string,
  backgroundLayerCornerRadius: PropTypes.number,

  // Ripple effect
  rippleEnabled: PropTypes.bool,
  ripplePercent: PropTypes.number,
  rippleLayerColor: PropTypes.string,
  rippleAniTimingFunction: aniTimingFunc,

  // Starting point of the ripple effect
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
