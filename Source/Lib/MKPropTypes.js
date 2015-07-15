/**
 * Created by ywu on 15/7/16.
 */
var { PropTypes } = require('react-native');

module.exports = {
  shadowColor: PropTypes.string,
  shadowOffset: PropTypes.objectOf({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  shadowOpacity: PropTypes.number,
  shadowRadius: PropTypes.number,

  cornerRadius: PropTypes.number,
  maskEnabled: PropTypes.bool,
  backgroundColor: PropTypes.string,
  backgroundLayerColor: PropTypes.string,
  backgroundLayerCornerRadius: PropTypes.number,
  backgroundAniEnabled: PropTypes.bool,
  ripplePercent: PropTypes.number,
  rippleLayerColor: PropTypes.string,
  rippleAniTimingFunction: PropTypes.oneOf([
    'linear',
    'easeIn',
    'easeOut',
  ]),
  rippleLocation: PropTypes.oneOf([
    'tapLocation',
    'center',
    'left',
    'right',
  ]),
}