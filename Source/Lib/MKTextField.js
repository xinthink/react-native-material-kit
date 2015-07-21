/**
 * Created by ywu on 15/7/16.
 */

const React = require('react-native');
const {
  requireNativeComponent,
  PropTypes,
} = React;

const MKPropTypes = require('./MKPropTypes');
const MKColor = require('./MKColor');


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
  // TODO configurable fonts
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
