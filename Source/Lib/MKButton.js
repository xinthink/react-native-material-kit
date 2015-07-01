/**
 * Created by ywu on 15/6/3.
 */
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;

class MKButton extends React.Component {
  render() {
    return <NativeButton {...this.props} />;
  }
}

MKButton.propTypes = {

  shadowColor: React.PropTypes.string,
  shadowOffset: React.PropTypes.objectOf({
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  }),
  shadowOpacity: React.PropTypes.number,
  shadowRadius: React.PropTypes.number,

  cornerRadius: React.PropTypes.number,
  maskEnabled: React.PropTypes.bool,
  backgroundColor: React.PropTypes.string,
  backgroundLayerColor: React.PropTypes.string,
  backgroundLayerCornerRadius: React.PropTypes.number,
  backgroundAniEnabled: React.PropTypes.bool,
  ripplePercent: React.PropTypes.number,
  rippleLayerColor: React.PropTypes.string,
  rippleAniTimingFunction: React.PropTypes.oneOf([
    'linear',
    'easeIn',
    'easeOut',
  ]),
  rippleLocation: React.PropTypes.oneOf([
    'tapLocation',
    'center',
    'left',
    'right',
  ]),
};

var NativeButton = requireNativeComponent('MKButton', MKButton);

module.exports = MKButton;