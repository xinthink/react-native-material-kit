/**
 * Created by ywu on 15/7/16.
 */
var { PropTypes } = require('react-native');

var dimen = PropTypes.objectOf({
  width: PropTypes.number,
  height: PropTypes.number,
});

var aniTimingFunc = PropTypes.oneOf([
  'linear',
  'easeIn',
  'easeOut',
]);

var mkLayerPropTypes = {
  // FIXME naming conflicts with built-in properties, such as shadowOffset
  // lead to runtime warning: Failed propType: typeChecker is not a function Check the render method of xxx
  shadowColor: PropTypes.string,
  shadowOffset: dimen,
  shadowOpacity: PropTypes.number,
  shadowRadius: PropTypes.number,
  shadowPathEnabled: PropTypes.bool,

  cornerRadius: PropTypes.number,
  maskEnabled: PropTypes.bool,
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


exports.dimen = dimen;
exports.aniTimingFunc = aniTimingFunc;
exports.mkLayerPropTypes = mkLayerPropTypes;