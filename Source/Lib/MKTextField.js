//
// MDL-style Textfield component.
//
// - @see [MDL Textfield](http://bit.ly/1HdFPR4)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/7/16.
//

const React = require('react-native');
const {
  requireNativeComponent,
  PropTypes,
  Text,
} = React;

const MKPropTypes = require('./MKPropTypes');
const MKColor = require('./MKColor');
const {getTheme} = require('./theme');

//
// ## MKTextField
// `MKTextField` component supports floating label and ripple effect.
//
class MKTextField extends React.Component {
  _callback(callbackName, event) {
    if (this.props[callbackName]) {
      this.props[callbackName](event.nativeEvent);
    }
  }

  render() {
    return (
      <NativeTextField
        {...this.props}
        style={[MKTextField.defaultProps.style, this.props.style]}
        onChange={this._callback.bind(this, 'onTextChange')}
        onFocus={this._callback.bind(this, 'onFocus')}
        onBlur={this._callback.bind(this, 'onBlur')}
        onEndEditing={this._callback.bind(this, 'onEndEditing')}
        onSubmitEditing={this._callback.bind(this, 'onSubmitEditing')}
      />
    );
  }
}

// ## <section id='props'>Props</section>
MKTextField.propTypes = {
  // [Common MKLayer Props](MKPropTypes.html#mkLayerPropTypes)...
  ...MKPropTypes.mkLayerPropTypes,

  // Input value
  text: PropTypes.string,

  // Secure text entry mode
  password: PropTypes.bool,

  // Editable or read-only mode
  editable: PropTypes.bool,

  // Placehoder (hint), also used as floating label text
  placeholder: PropTypes.string,

  // The space between text and the border, [Dimen](MKPropTypes.html#dimen)
  padding: MKPropTypes.dimen,

  // Enable floating label effect
  floatingLabelEnabled: PropTypes.bool,

  // The gap between floating label and the input text
  floatingLabelBottomMargin: PropTypes.number,

  // [Font](MKPropTypes.html#font) of the floating label
  floatingLabelFont: MKPropTypes.font,

  // The highlighted bottom border effect
  bottomBorderEnabled: PropTypes.bool,

  // The width of bottom border
  bottomBorderWidth: PropTypes.number,

  // Color of the highlighted bottom border, and also the floating label color
  highlightColor: PropTypes.string,

  // Color of the unhighlighted bottom border, cursor and the placeholder
  tintColor: PropTypes.string,

  // Callback when the input text changed
  onTextChange: PropTypes.func,

  // Callback that is called when the text input is focused
  onFocus: PropTypes.func,

  // Callback that is called when the text input is blurred
  onBlur: PropTypes.func,

  // Callback that is called when text input ends.
  onEndEditing: PropTypes.func,

  // Callback that is called when the text input's submit button is pressed.
  onSubmitEditing: PropTypes.func,

  // TODO support multiline
  // TODO configurable fonts

  // configurable keyboard & return types
  // Determines which keyboard to open, e.g.`numeric`.
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

  // If false, disables auto-correct. Default value is true.
  autoCorrect: PropTypes.bool,

  // Determines how the return key should look.
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

  // If true, the keyboard disables the return key when there is no text and
  // automatically enables it when there is text. Default value is false.
  autoReturnKey: PropTypes.bool,

  // Can tell TextInput to automatically capitalize certain characters.
  // - characters: all characters,
  // - words: first letter of each word
  // - sentences: first letter of each sentence (default)
  // - none: don't auto capitalize anything
  autoCapitalize: PropTypes.oneOf([
    'none',
    'sentences',
    'words',
    'characters',
  ]),

  style: Text.propTypes.style,
};

// ## <section id='defaults'>Defaults</section>
MKTextField.defaultProps = {
  floatingLabelFont: {
    fontSize: 12,
  },
  style: {
    color: getTheme().fontColor,
  },
};

const NativeTextField = requireNativeComponent('MKTextField', MKTextField);


// --------------------------
// Builder
//
const {
  Builder,
} = require('./builder');

//
// ## Textfield builder
//
class MKTextFieldBuilder extends Builder {
  constructor() {
    super();
    this.withBackgroundColor(MKColor.Transparent);
  }

  mergeStyle() {
    super.mergeStyle();

    if (!this.highlightColor) {
      this.highlightColor = this.getThemeColor();
    }
  }

  build() {
    const props = this.toProps();

    return React.createClass({
      render: function () {
        return (
          <MKTextField {...Object.assign({}, props, this.props)}/>
        );
      },
    });
  }
}

// define builder method for each prop
MKTextFieldBuilder.defineProps(MKTextField.propTypes);


// ----------
// ## <secion id="builders">Built-in builders</secton>
//
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


// ## Public interface
module.exports = MKTextField;

MKTextField.Builder = MKTextFieldBuilder;
MKTextField.textfield = textfield;
MKTextField.textfieldWithRipple = textfieldWithRipple;
MKTextField.textfieldWithFloatingLabel = textfieldWithFloatingLabel;
MKTextField.textfieldWithRippleAndFloatingLabel = textfieldWithRippleAndFloatingLabel;
