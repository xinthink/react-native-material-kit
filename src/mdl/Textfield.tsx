/**
 * MDL style textfield component.
 *
 * See {@link http://www.getmdl.io/components/index.html#textfields-section | MDL Textfield}
 *
 * Created by ywu on 15/8/3.
 */
import React, { Component, createRef } from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

import FloatingLabel, { FloatingLabelPublicProps } from '../internal/textfield/FloatingLabel';
import Underline, { UnderlinePublicProps } from '../internal/textfield/Underline';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
import { NullableString } from '../types';
import CompositeAnimation = Animated.CompositeAnimation;

/** Props of the {@link Textfield} component */
export interface TextfieldProps extends TextInputProps, FloatingLabelPublicProps, UnderlinePublicProps {
  /** Initial text of the input, alias to `value` */
  text?: string;

  /** alias to `onChangeText` */
  onTextChange?: (text: string) => void;

  /** Alias to `secureTextEntry` */
  password?: boolean;

  /** Color of the un-highlighted underline, and the placeholder
   * - TODO cursor color is not affected for now
   * @see https://github.com/facebook/react-native/issues/1685
   */
  tint?: any;

  /** Color of the highlighted underline, and also the floating label */
  highlightColor?: any;

  /** Style applied to the `TextInput` component, ok to use `StyleSheet` */
  textInputStyle?: StyleProp<TextStyle>;

  /** Additional props passed directly to the react native `TextInput` component */
  additionalInputProps?: TextInputProps;
}

/** State of the {@link Textfield} component */
interface TextfieldState {
  inputMarginTop: number;
}

/** Default props of the {@link Textfield} component */
const defaultProps: Partial<TextfieldProps> = {
  // tintColor: 'rgba(0,0,0,.12)',
  // highlightColor: getTheme().primaryColor,
  // floatingLabelFont: {
  //   fontSize: getTheme().fontSize - 2,
  // },
  style: {
    height: 39,
  },
  // textInputStyle: {
  //   color: getTheme().fontColor,
  //   fontSize: getTheme().fontSize + 2,
  //   paddingLeft: 0,
  //   paddingRight: 0,
  // },
  floatingLabelEnabled: true,
  floatingLabelAniDuration: 200,
  underlineEnabled: true,
  underlineSize: 2,
};

/**
 * The `Textfield` component, which has an optional {@link FloatingLabel} and {@link Underline}.
 * - TODO styling `read-only` & `disabled` mode
 */
export default class Textfield extends Component<TextfieldProps, TextfieldState> {
  /** Defaults, see {@link defaultProps} */
  static defaultProps = defaultProps;

  private theme = getTheme();
  private readonly inputFrame: { left: number; top: number; width: number; height: number };
  private inputRef = createRef<TextInput>();
  private labelRef = createRef<FloatingLabel>();
  private underlineRef = createRef<Underline>();
  private anim?: CompositeAnimation;
  private _bufferedValue: NullableString;
  private _originPlaceholder: NullableString;

  constructor(props: TextfieldProps) {
    super(props);
    this.inputFrame = { left: 0, top: 0, width: 0, height: 0 };
    this.state = {
      inputMarginTop: 0,
    };
  }

  private set bufferedValue(v: NullableString) {
    this._bufferedValue = v;
    if (v) {
      this._aniFloatLabel();
    }
  }

  private get bufferedValue(): NullableString {
    return (this._bufferedValue || '').trim();
  }

  private set placeholder(placeholder: string) {
    this.inputRef.current && this.inputRef.current.setNativeProps({ placeholder });
  }

  /**
   * Requests focus for the given input or view. The exact behavior triggered
   * will depend on the platform and type of view.
   */
  focus() {
    this.inputRef.current && this.inputRef.current.focus();
  }

  /**
   * Checks if the input is currently focused.
   */
  isFocused(): boolean {
    return (this.inputRef.current && this.inputRef.current.isFocused()) === true;
  }

  /**
   * Removes focus from an input or view. This is the opposite of `focus()`.
   */
  blur() {
    this.inputRef.current && this.inputRef.current.blur();
  }

  UNSAFE_componentWillMount() {
    this.bufferedValue = this.props.value || this.props.text || this.props.defaultValue;
    this._originPlaceholder = this.props.placeholder;
  }

  UNSAFE_componentWillReceiveProps(nextProps: TextfieldProps) {
    const newText = nextProps.value || nextProps.text || nextProps.defaultValue;
    if (newText) {
      this.bufferedValue = newText;
    }
    this._originPlaceholder = nextProps.placeholder;
  }

  componentDidMount() {
    requestAnimationFrame(this._doMeasurement);
  }

  render() {
    const tfTheme = this.theme.textfieldStyle as any;
    const floatingLabel = this.props.floatingLabelEnabled ? (
      <FloatingLabel
        ref={this.labelRef}
        {...this.props}
        label={this.props.placeholder}
        tint={this.props.tint || tfTheme.tintColor}
        highlightColor={this.props.highlightColor || tfTheme.highlightColor}
        floatingLabelFont={this.props.floatingLabelFont || tfTheme.floatingLabelFont}
      />
    ) : null;
    const underline = (
      <Underline
        ref={this.underlineRef}
        {...this.props}
        tint={this.props.tint || tfTheme.tintColor}
        highlightColor={this.props.highlightColor || tfTheme.highlightColor}
        underlineAniDur={this.props.floatingLabelAniDuration}
      />
    );

    return (
      <View style={this.props.style} onLayout={this._doMeasurement}>
        {floatingLabel}
        <TextInput
          ref={this.inputRef}
          {...this.props}
          {...this.props.additionalInputProps}
          style={[
            {
              backgroundColor: MKColor.Transparent,
              alignSelf: 'stretch',
              paddingTop: 2,
              paddingBottom: 2,
              marginTop: this.state.inputMarginTop,
            },
            tfTheme.textInputStyle,
            this.props.textInputStyle,
          ]}
          onChangeText={this._onTextChange}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          secureTextEntry={this.props.password}
          underlineColorAndroid="transparent"
        />
        {underline}
      </View>
    );
  }

  private _onTextChange = (text: string) => {
    this.bufferedValue = text;
    this._callback('onTextChange', text);
    this._callback('onChangeText', text);
  };

  private _onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this._aniStartHighlight(true);
    this._callback('onFocus', e);
  };

  private _onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    this._aniStopHighlight();
    this._callback('onBlur', e);
  };

  private startAnimations(animations: CompositeAnimation[], cb?: Animated.EndCallback) {
    if (animations.length) {
      this.anim && this.anim.stop();
      this.anim = Animated.parallel(animations);
      this.anim.start(cb);
    }
  }

  private _doMeasurement = () => {
    if (this.inputRef.current) {
      this.inputRef.current.measure(this._onInputMeasured);
    }
    if (this.props.floatingLabelEnabled && this.labelRef.current) {
      this.labelRef.current.measure(this._onLabelMeasured);
    }
  };

  private _onLabelMeasured = (left: number, top: number, width: number, height: number) => {
    this.setState({ inputMarginTop: height });
  };

  private _onInputMeasured = (left: number, top: number, width: number, height: number) => {
    Object.assign(this.inputFrame, { left, top, width, height });
    if (this.underlineRef.current) {
      this.underlineRef.current.updateLineLength(width, () => {
        if (this.bufferedValue || this.isFocused()) {
          this._aniStartHighlight(this.isFocused()); // if input not empty, lift the label
        }
      });
    }
  };

  private _aniFloatLabel() {
    if (this.bufferedValue && this.props.floatingLabelEnabled && this.labelRef.current) {
      this.startAnimations(this.labelRef.current.aniFloatLabel());
    }
  }

  // animation when textfield focused
  private _aniStartHighlight(focused: boolean) {
    if (this.props.floatingLabelEnabled) {
      // hide fixed placeholder, if floating
      this.placeholder = '';

      // and show floating label
      // FIXME workaround https://github.com/facebook/react-native/issues/3220
      if (this.labelRef.current) {
        this.labelRef.current.updateLabel(this._originPlaceholder || '');
      }
    }

    if (this.underlineRef.current && this.labelRef.current) {
      this.startAnimations([
        ...this.underlineRef.current.aniStretchUnderline(focused), // stretch the underline if enabled
        ...this.labelRef.current.aniFloatLabel(), // and lift the floating label, if enabled
      ]);
    }
  }

  // animation when textfield lost focus
  private _aniStopHighlight() {
    if (this.underlineRef.current && this.labelRef.current) {
      const onEnd = () => {
        if (this.props.floatingLabelEnabled) {
          // show fixed placeholder after floating label collapsed
          this.placeholder = this._originPlaceholder || '';

          // and hide floating label
          // FIXME workaround https://github.com/facebook/react-native/issues/3220
          if (!this.bufferedValue && this.labelRef.current) {
            this.labelRef.current.updateLabel('');
          }
        }
      };

      this.startAnimations(
        [
          ...this.underlineRef.current.aniShrinkUnderline(), // shrink the underline
          ...(!this.bufferedValue ? this.labelRef.current.aniSinkLabel() : []), // input is empty, label should be pulled down
        ],
        onEnd
      );
    }
  }

  private _callback(prop: string, evt?: any) {
    const props = this.props as any;
    props[prop] && props[prop](evt);
  }
}
