//
// MDL style textfield component.
//
// - @see [MDL Textfield](http://www.getmdl.io/components/index.html#textfields-section)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/8/3.
//

const React = require('react-native');

const {
  Component,
  View,
  TextInput,
  PropTypes,
  Animated,
} = React;

const MKPropTypes = require('../MKPropTypes');
const MKColor = require('../MKColor');
const utils = require('../utils');
const {getTheme} = require('../theme');
import {
  pick,
} from 'ramda';

//
// ## <section id='FloatingLabel'>FloatingLabel</section>
// `FloatingLabel` component of the [`Textfield`](#Textfield).
//
class FloatingLabel extends Component {
  constructor(props) {
    super(props);
    this.labelDim = {};
    this.labelState = {
      opacity: new Animated.Value(0),
      top: new Animated.Value(0),
    };
    this.state = {
      text: '',
    };
  }

  componentWillMount() {
    this.updateText(this.props.text);
  }

  componentWillReceiveProps(nextProps) {
    this.updateText(nextProps.text);
  }

  updateText(text) {
    this.setState({text});
  }

  measure(cb) {
    if (this.refs.label) {
      return this.refs.label.refs.node.measure(cb);
    }
  }

  _onLabelLayout({nativeEvent: {layout: {width, height}}}) {
    if (width !== this.labelDim.width || height !== this.labelDim.height) {
      this.labelDim = {width, height};
    }
  }

  setColor(color) {
    // color has to be wrapped into the style object since RN 0.13
    this.refs.label.setNativeProps({style:{color: utils.parseColor(color)}});
  }

  aniFloatLabel() {
    if (!this.props.floatingLabelEnabled) {
      return [];
    }

    this.setColor(this.props.highlightColor);
    return [Animated.sequence([
      Animated.timing(this.labelState.opacity, {
        toValue: 1,
        duration: this.props.opacityAniDur,
      }),
      Animated.timing(this.labelState.top, {
        toValue: 0,
        duration: this.props.floatingLabelAniDuration,
      }),
    ])];
  }

  aniSinkLabel() {
    if (!this.props.floatingLabelEnabled) {
      return [];
    }

    this.setColor(this.props.tintColor);
    return [Animated.sequence([
      Animated.timing(this.labelState.top, {
        toValue: this.labelDim.height + 5,
        duration: this.props.floatingLabelAniDuration,
      }),
      Animated.timing(this.labelState.opacity, {
        toValue: 0,
        duration: this.props.opacityAniDur,
      }),
    ])];
  }

  render() {
    return (
      <Animated.Text
        ref="label"
        pointerEvents="none"
        style={[{
            backgroundColor: MKColor.Transparent,
            position: 'absolute',
            top: this.labelState.top,
            opacity: this.labelState.opacity,
            marginBottom: this.props.floatingLabelBottomMargin,
          },
          this.props.floatingLabelFont,
        ]}
        onLayout={this._onLabelLayout.bind(this)}
      >
        {this.state.text}
      </Animated.Text>
    );
  }
}

// ## <section id='floatingLabelProps'>FloatingLabel Props</section>
FloatingLabel.publicPropTypes = {
  // Enable floating label effect
  floatingLabelEnabled: PropTypes.bool,

  // Duration of floating transition, also affect underline animation
  floatingLabelAniDuration: PropTypes.number,

  // Spacing between floating label and input text
  floatingLabelBottomMargin: PropTypes.number,

  // [Font](MKPropTypes.html#font) of floating label
  // FIXME causing warning: `typeChecker is not a function`
  floatingLabelFont: MKPropTypes.font,
};

FloatingLabel.propTypes = {
  ...FloatingLabel.publicPropTypes,

  // internal props
  tintColor: PropTypes.string,
  highlightColor: PropTypes.string,
  opacityAniDur: PropTypes.number,
};

FloatingLabel.defaultProps = {
  floatingLabelAniDuration: 200,
  opacityAniDur: 30,
};


//
// ## <section id='Underline'>Underline</section>
// `Underline` component of the [`Textfield`](#Textfield).
//
class Underline extends Component {
  constructor(props) {
    super(props);
    this.animatedLeft = new Animated.Value(0);
    this.animatedLineLength = new Animated.Value(0);
    this.state = {
      lineLength: 0,
    };
  }

  // update the length of stretched underline
  updateLineLength(lineLength, cb) {
    this.setState({lineLength}, cb);
  }

  // stretch the line, from center
  aniStretchUnderline(focused) {
    if (!(this.props.underlineEnabled && focused)) {
      return [];
    }

    this.animatedLeft.setValue(this.state.lineLength / 2);
    return [
      Animated.timing(this.animatedLeft, {
        toValue: 0,
        duration: this.props.underlineAniDur,
      }),
      Animated.timing(this.animatedLineLength, {
        toValue: this.state.lineLength,
        duration: this.props.underlineAniDur,
      }),
    ];
  }

  // collapse the the line to a single point at center
  aniShrinkUnderline() {
    if (!this.props.underlineEnabled) {
      return [];
    }

    return [
      Animated.timing(this.animatedLeft, {
        toValue: this.state.lineLength / 2,
        duration: this.props.underlineAniDur,
      }),
      Animated.timing(this.animatedLineLength, {
        toValue: 0,
        duration: this.props.underlineAniDur,
      }),
    ];
  }

  render() {
    return (
      <View pointerEvents="none"
            style={{
              //top: -this.props.underlineSize,
              height: this.props.underlineSize,
            }}
        >
        <View  // the default silver border
          style={{
            position: 'absolute',
            backgroundColor: this.props.tintColor,
            height: this.props.underlineSize,
            width: this.state.lineLength,
          }}
        />
        {(() => {
          // the colorful forefront line, animation enabled
          if (this.props.underlineEnabled) {
            return (
              <Animated.View
                style={{
                  position: 'absolute',
                  backgroundColor: this.props.highlightColor,
                  height: this.props.underlineSize,
                  left: this.animatedLeft,
                  width: this.animatedLineLength,
                }}
              />
            );
          }
        })()}
      </View>
    );
  }
}

Underline.propTypes = {
  // internal props
  underlineEnabled: PropTypes.bool,
  tintColor: PropTypes.string,
  highlightColor: PropTypes.string,
  underlineSize: PropTypes.number,
  underlineAniDur: PropTypes.number,
};

Underline.defaultProps = {
  underlineEnabled: true,
  underlineAniDur: FloatingLabel.defaultProps.floatingLabelAniDuration,
  underlineSize: 1,
};


//
// ## <section id='Textfield'>Textfield</section>
// `Textfield` component,
// which has floating label and underline effect.
// - TODO styling read-only & diabled mode
//
class Textfield extends Component {
  constructor(props) {
    super(props);
    this.theme = getTheme();
    this.inputFrame = {};
    this.state = {
      inputMarginTop: 0,
    };
  }

  set bufferedValue(v) {
    this._bufferedValue = v;
    if (v) {
      this._aniFloatLabel();
    }
  }

  get bufferedValue() {
    return (this._bufferedValue || '').trim();
  }

  focus() {
    this.refs.input.focus();
  }

  isFocused() {
    return this.refs.input.isFocused();
  }

  componentWillMount() {
    this.bufferedValue = this.props.value || this.props.text ||
      this.props.defaultValue;
    this._originPlaceholder = this.props.placeholder;
  }

  componentWillReceiveProps(nextProps) {
    const newText = nextProps.value || nextProps.text || nextProps.defaultValue;
    if (newText) {
      this.bufferedValue = newText;
    }
    this._originPlaceholder = nextProps.placeholder;
  }

  componentDidMount() {
    requestAnimationFrame(this._doMeasurement.bind(this));
  }

  _doMeasurement() {
    if (this.refs.input) {
      this.refs.input.measure(this._onInputMeasured.bind(this));
        if (this.props.floatingLabelEnabled) {
          this.refs.floatingLabel.measure(this._onLabelMeasured.bind(this));
        }
      }
  }

  _onLabelMeasured(left, top, width, height) {
    this.setState({inputMarginTop: height});
  }

  _onInputMeasured(left, top, width, height) {
    Object.assign(this.inputFrame, {left, top, width, height});
    this.refs.underline.updateLineLength(width, () => {
      if (this.bufferedValue || this.isFocused()) {
        this._aniStartHighlight(this.isFocused());  // if input not empty, lift the label
      }
    });
  }

  _aniFloatLabel() {
    if (!(this.bufferedValue && this.props.floatingLabelEnabled)) {
      return;
    }

    if (this.refs.floatingLabel) {
      const animations = this.refs.floatingLabel.aniFloatLabel();
      if (animations.length) {
        Animated.parallel(animations).start();
      }
    }
  }

  // animation when textfield focused
  _aniStartHighlight(focused) {
    if (this.props.floatingLabelEnabled) {
      // hide fixed placeholder, if floating
      this.setPlaceholder('');

      // and show floating label
      // FIXME workaround https://github.com/facebook/react-native/issues/3220
      this.refs.floatingLabel.updateText(this._originPlaceholder);
    }

    // stretch the underline if enabled
    const animations = this.refs.underline.aniStretchUnderline(focused);

    // and lift the floating label, if enabled
    if (this.props.floatingLabelEnabled) {
      animations.push(...this.refs.floatingLabel.aniFloatLabel());
    }

    if (animations.length) {
      Animated.parallel(animations).start();
    }
  }

  // animation when textfield lost focus
  _aniStopHighlight() {
    // shrink the underline
    const animations = this.refs.underline.aniShrinkUnderline();

    // pull down the label, or keep position if input is not empty
    if (this.props.floatingLabelEnabled && !this.bufferedValue) {
      // input is empty, label should be pulled down
      animations.push(...this.refs.floatingLabel.aniSinkLabel());
    }

    if (animations.length) {
      Animated.parallel(animations).start(() => {
        if (this.props.floatingLabelEnabled) {
          // then show fixed placeholder
          this.setPlaceholder(this._originPlaceholder);

          // and hide floating label
          // FIXME workaround https://github.com/facebook/react-native/issues/3220
          if (!this.bufferedValue) {
            this.refs.floatingLabel.updateText('');
          }
        }
      });
    }
  }

  setPlaceholder(placeholder) {
    this.refs.input.setNativeProps({placeholder});
  }

  _onTextChange(text) {
    this.bufferedValue = text;
    this._callback('onTextChange', text);
    this._callback('onChangeText', text);
  }

  _onFocus(e) {
    this._aniStartHighlight(true);
    this._callback('onFocus', e);
  }

  _onBlur(e) {
    this._aniStopHighlight();
    this._callback('onBlur', e);
  }

  _callback(name, e) {
    if (this.props[name]) {
      this.props[name](e);
    }
  }

  render() {
    const tfTheme = this.theme.textfieldStyle;
    let floatingLabel;
    if (this.props.floatingLabelEnabled) {
      // the floating label
      const props = Object.assign(
        pick(['tintColor', 'highlightColor', 'floatingLabelFont'], tfTheme),
        utils.extractProps(this, FloatingLabel.propTypes));

      floatingLabel = (
        <FloatingLabel ref="floatingLabel"
          {...props}
          text={this.props.placeholder}
        />
      );
    }

    const underlineProps = Object.assign(
      pick(['tintColor', 'highlightColor'], tfTheme),
      utils.extractProps(this, ['tintColor',
        'highlightColor', 'underlineSize', 'underlineEnabled']));
    const inputProps = utils.extractProps(this, {
      ...TextInput.propTypes,
      password: 1,
    });

    return (
      <View style={this.props.style} >
        <TextInput  // the input
          ref="input"
          {...inputProps}
          style={[{
             backgroundColor: MKColor.Transparent,
             flex: 1,
             alignSelf: 'stretch',
             paddingTop: 2, paddingBottom: 2,
             marginTop: this.state.inputMarginTop,
            },
            this.theme.textfieldStyle.textInputStyle,
            this.props.textInputStyle,
          ]}
          onChangeText={this._onTextChange.bind(this)}
          onFocus={this._onFocus.bind(this)}
          onBlur={this._onBlur.bind(this)}
        />
        {floatingLabel}
        <Underline ref="underline"  // the underline
                   {...underlineProps}
                   underlineAniDur={this.props.floatingLabelAniDuration}
        />
      </View>
    );
  }
}

// ## <section id='props'>Props</section>
Textfield.propTypes = {
  // [TextInput Props](https://facebook.github.io/react-native/docs/textinput.html#props)...
  ...TextInput.propTypes,

  // Alias to `value`
  text: PropTypes.string,

  // alias to `onChangeText`
  onTextChange: PropTypes.func,

  // Alias to `secureTextEntry`
  password: PropTypes.bool,

  // [Floating Label Props](#floatingLabelProps)...
  ...FloatingLabel.publicPropTypes,

  // The highlighted bottom border effect
  underlineEnabled: PropTypes.bool,

  // The thickness of the Underline
  underlineSize: PropTypes.number,

  // Color of the highlighted underline, and also the floating label
  highlightColor: PropTypes.string,

  // Color of the un-highlighted underline, and the placeholder
  // - TODO cursor color is not affected for now
  // @see https://github.com/facebook/react-native/issues/1685
  tintColor: PropTypes.string,

  // Style applied to the `TextInput` component, ok to use `StyleSheet`
  textInputStyle: PropTypes.any,
};

// ## <section id='defaults'>Defaults</section>
Textfield.defaultProps = {
  //tintColor: 'rgba(0,0,0,.12)',
  //highlightColor: getTheme().primaryColor,
  //floatingLabelFont: {
  //  fontSize: getTheme().fontSize - 2,
  //},
  style: {
    height: 39,
  },
  //textInputStyle: {
  //  color: getTheme().fontColor,
  //  fontSize: getTheme().fontSize + 2,
  //  paddingLeft: 0,
  //  paddingRight: 0,
  //},
  underlineEnabled: true,
};


// --------------------------
// Builder
//
const {
  Builder,
} = require('../builder');

//
// ## Textfield builder
//
class TextfieldBuilder extends Builder {
  constructor() {
    super();
  }

  // For compatibility with RN version older than 0.9.0.
  // > Since [RN v0.9.0][], `TextInput` became a [controlled component][]
  // [RN v0.9.0]: https://github.com/facebook/react-native/releases/tag/v0.9.0-rc
  // [controlled component]: https://facebook.github.io/react/docs/forms.html#controlled-components
  withDefaultValue(defaultValue) {
    const propName = Textfield.propTypes.defaultValue ? 'defaultValue' : 'value';
    this[propName] = defaultValue;
    return this;
  }

  mergeStyle() {
    super.mergeStyle();

    if (!this.highlightColor) {
      this.highlightColor = this.getThemeColor();
    }
  }

  build() {
    const BuiltTextfield = class extends Textfield {};
    BuiltTextfield.defaultProps = Object.assign({}, Textfield.defaultProps, this.toProps());
    return BuiltTextfield;
  }
}

// define builder method for each prop
TextfieldBuilder.defineProps(Textfield.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//
function textfield() {
  return new TextfieldBuilder();
}

function textfieldWithFloatingLabel() {
  return textfield().withFloatingLabelEnabled(true);
}


// ## Public interface
module.exports = Textfield;

Textfield.Builder = TextfieldBuilder;
Textfield.textfield = textfield;
Textfield.textfieldWithFloatingLabel = textfieldWithFloatingLabel;
