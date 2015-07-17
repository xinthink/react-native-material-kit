/**
 * Created by ywu on 15/6/3.
 */
'use strict';

var React = require('react-native');
var {
  requireNativeComponent,
  TouchableWithoutFeedback,
} = React;
var MKPropTypes = require('./MKPropTypes');

class MKButton extends React.Component {
  render() {
    var touchableProps = {};
    if (!this.props.disabled) {
      touchableProps.onPress = this.props.onPress;
      touchableProps.onPressIn = this.props.onPressIn;
      touchableProps.onPressOut = this.props.onPressOut;
      touchableProps.onLongPress = this.props.onLongPress;
    }

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <NativeButton {...this.props} />
      </TouchableWithoutFeedback>
    );
  }
}

MKButton.propTypes = {
  ...MKPropTypes.mkLayerPropTypes,
  disabled: React.PropTypes.bool,
};

var NativeButton = requireNativeComponent('MKButton', MKButton);

module.exports = MKButton;