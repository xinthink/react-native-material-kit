/**
 * Created by ywu on 15/7/16.
 */

const React = require('react-native');
const {
  requireNativeComponent,
  PropTypes,
  Text,
} = React;

const MKPropTypes = require('./MKPropTypes');
const MKColor = require('./MKColor');
const {getTheme} = require('./theme');


class MKTextField extends React.Component {
  _callback(callbackName, event) {
    if (this.props[callbackName]) {
      this.props[callbackName](event.nativeEvent);
    }
  }

  render() {
    const defaultStyle = {
      color: getTheme().fontColor,
    };
    this.props.style = [defaultStyle, this.props.style];

    return (
      <NativeTextField
        {...this.props}
        onChange={(e) => this._callback('onTextChange', e)}
        onFocus={(e) => this._callback('onFocus', e)}
        onBlur={(e) => this._callback('onBlur', e)}
        onEndEditing={(e) => this._callback('onEndEditing', e)}
        onSubmitEditing={(e) => this._callback('onSubmitEditing', e)}
      />
    );
  }
}

MKTextField.propTypes = {
  ...MKPropTypes.mkLayerPropTypes,

  text: PropTypes.string,
  // secureTextEntry: PropTypes.bool,
  password: PropTypes.bool,
  editable: PropTypes.bool,
  placeholder: PropTypes.string,
  padding: MKPropTypes.dimen,
  floatingLabelEnabled: PropTypes.bool,
  floatingLabelBottomMargin: PropTypes.number,
  floatingLabelFont: MKPropTypes.font,
  bottomBorderEnabled: PropTypes.bool,
  bottomBorderWidth: PropTypes.number,
  highlightColor: PropTypes.string,
  tintColor: PropTypes.string,
  onTextChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onEndEditing: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  // TODO support multiline
  // TODO configurable fonts

  // configurable keyboard & return types
  /**
   * Determines which keyboard to open, e.g.`numeric`.
   */
  keyboardType: PropTypes.oneOf([
    // Cross-platform
    'default',
    'numeric',
    'email-address',
    // iOS-only
    'ascii-capable',
    'numbers-and-punctuation',
    'url',
    'number-pad',
    'phone-pad',
    'name-phone-pad',
    'decimal-pad',
    'twitter',
    'web-search',
  ]),
  autoCorrect: PropTypes.bool,
  /**
   * Determines how the return key should look.
   */
  returnKeyType: PropTypes.oneOf([
    'default',
    'go',
    'google',
    'join',
    'next',
    'route',
    'search',
    'send',
    'yahoo',
    'done',
    'emergency-call',
  ]),
  autoReturnKey: PropTypes.bool,
  autoCapitalize: PropTypes.oneOf([
    'none',
    'sentences',
    'words',
    'characters',
  ]),

  style: Text.propTypes.style,
  floatingLabelFont: MKPropTypes.font,
};

const NativeTextField = requireNativeComponent('MKTextField', MKTextField);


// --------------------------
// builders
//
const {
  Builder,
} = require('./builder');

/**
 * Textfiled builder
 */
class MKTextFieldBuilder extends Builder {
  constructor() {
    super();
    this.withBackgroundColor(MKColor.Transparent);
  }

  withText(v) {
    this.text = v;
    return this;
  }

  withPlaceholder(v) {
    this.placeholder = v;
    return this;
  }

  withPassword(isPassword) {
    this.password = isPassword;
    return this;
  }

  withPadding(v) {
    this.padding = v;
    return this;
  }

  withFloatingLabelEnabled(v) {
    this.floatingLabelEnabled = v;
    return this;
  }

  withFloatingLabelBottomMargin(v) {
    this.floatingLabelBottomMargin = v;
    return this;
  }

  withFloatingLabelFont(v) {
    this.floatingLabelFont = v;
    return this;
  }

  withBottomBorderEnabled(v) {
    this.bottomBorderEnabled = v;
    return this;
  }

  withBottomBorderWidth(v) {
    this.bottomBorderWidth = v;
    return this;
  }

  withHighlightColor(v) {
    this.highlightColor = v;
    return this;
  }

  withTintColor(v) {
    this.tintColor = v;
    return this;
  }

  withOnTextChange(cb) {
    this.onTextChange = cb;
    return this;
  }

  withOnFocus(cb) {
    this.onFocus = cb;
    return this;
  }

  withOnBlur(cb) {
    this.onBlur = cb;
    return this;
  }

  withOnEndEditing(cb) {
    this.onEndEditing = cb;
    return this;
  }

  withOnSubmitEditing(cb) {
    this.onSubmitEditing = cb;
    return this;
  }

  withEditable(v) {
    this.editable = v;
    return this;
  }

  withAutoCorrect(v) {
    this.autoCorrect = v;
    return this;
  }

  withAutoCapitalize(v) {
    this.autoCapitalize = v;
    return this;
  }

  withKeyboardType(v) {
    this.keyboardType = v;
    return this;
  }

  withReturnKeyType(v) {
    this.returnKeyType = v;
    return this;
  }

  withAutoReturnKey(v) {
    this.autoReturnKey = v;
    return this;
  }

  mergeStyle() {
    super.mergeStyle();

    if (!this.highlightColor) {
      this.highlightColor = this.getThemeColor();
    }
  }

  build() {
    const props = this.toProps();
    // console.log(props);

    return React.createClass({
      render: function () {
        return (
          <MKTextField {...props}/>
        );
      },
    });
  }
}

/**
 * Built-in text field builders
 */
function textfield() {
  return new MKTextFieldBuilder().withCornerRadius(1);
}

function textfieldWithFloatingLabel() {
  return textfield().withFloatingLabelEnabled(true);
}

function textfieldWithRipple() {
  return textfield().withRippleEnabled(true);
}

function textfieldWithRippleAndFloatingLabel() {
  return textfieldWithRipple().withFloatingLabelEnabled(true);
}


module.exports = MKTextField;

MKTextField.Builder = MKTextFieldBuilder;
MKTextField.textfield = textfield;
MKTextField.textfieldWithRipple = textfieldWithRipple;
MKTextField.textfieldWithFloatingLabel = textfieldWithFloatingLabel;
MKTextField.textfieldWithRippleAndFloatingLabel = textfieldWithRippleAndFloatingLabel;
