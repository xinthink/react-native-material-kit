/**
 * Created by ywu on 15/7/16.
 */

var React = require('react-native');
var {
  requireNativeComponent,
  PropTypes,
} = React;
var MKPropTypes = require('./MKPropTypes');
var MKColor = require('./MKColor');
var theme = require('./theme');

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
  floatingLabelEnabled: PropTypes.bool,
  floatingLabelBottomMargin: PropTypes.number,
  floatingLabelTextColor: PropTypes.string,
  bottomBorderEnabled: PropTypes.bool,
  bottomBorderWidth: PropTypes.number,
  highlightColor: PropTypes.string,
  tintColor: PropTypes.string,
  textColor: PropTypes.string,
};

var NativeTextField = requireNativeComponent('MKTextField', MKTextField);


// --------------------------
// builders
//
var {
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

  withFloatingLabelTextColor(v) {
    this.floatingLabelTextColor = v;
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

  withTextColor(v) {
    this.textColor = v;
    return this;
  }

  mergeStyle() {
    super.mergeStyle();

    if (!this.highlightColor) {
      this.highlightColor = this.getThemeColor();
    }

    if (!this.textColor) {
      this.textColor = this.getTheme().fontColor;
    }
  }

  build() {
    var theBuilder = this;
    var props = this.toProps();
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
var textfield = () => {
  return new MKTextFieldBuilder().withCornerRadius(1);
};

var textfieldWithFloatingLabel = () => {
  return textfield().withFloatingLabelEnabled(true);
};

var textfieldWithRipple = () => {
  return textfield().withRippleEnabled(true);
};

var textfieldWithRippleAndFloatingLabel = () => {
  return textfieldWithRipple().withFloatingLabelEnabled(true);
};


module.exports = MKTextField;

MKTextField.Builder = MKTextFieldBuilder;
MKTextField.textfield = textfield;
MKTextField.textfieldWithRipple = textfieldWithRipple;
MKTextField.textfieldWithFloatingLabel = textfieldWithFloatingLabel;
MKTextField.textfieldWithRippleAndFloatingLabel = textfieldWithRippleAndFloatingLabel;
