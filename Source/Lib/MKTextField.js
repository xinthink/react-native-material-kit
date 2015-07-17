/**
 * Created by ywu on 15/7/16.
 */

var React = require('react-native');
var {
  requireNativeComponent,
  PropTypes,
} = React;
var MKPropTypes = require('./MKPropTypes');

class MKTextField extends React.Component {
  render() {
    return <NativeTextField {...this.props} />;
  }
}

MKTextField.propTypes = {
  ...MKPropTypes.mkLayerPropTypes,

  text: PropTypes.string,
  placeholder: PropTypes.string,
  padding: MKPropTypes.dimen,
  floatingPlaceholderEnabled: PropTypes.bool,
  floatingLabelBottomMargin: PropTypes.number,
  floatingLabelTextColor: PropTypes.string,
  bottomBorderEnabled: PropTypes.bool,
  bottomBorderWidth: PropTypes.number,
  bottomBorderHighlightWidth: PropTypes.number,
  bottomBorderColor: PropTypes.string,
  tintColor: PropTypes.string,
};

var NativeTextField = requireNativeComponent('MKTextField', MKTextField);

module.exports = MKTextField;