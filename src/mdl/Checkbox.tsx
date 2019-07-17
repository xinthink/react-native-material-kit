//
// MDL-style Checkbox component.
//
// - @see [MDL Checkbox](http://www.getmdl.io/components/index.html#toggles-section/checkbox)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/12/13.
//

import React, {Component} from 'react';
import {
  Animated,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';

import {TouchEvent} from "../internal/MKTouchable";
import {AnimatedTick, TickProps} from '../internal/Tick';
import MKColor from '../MKColor';
import {getTheme} from '../theme';
import {CheckedListener} from '../types';
import * as utils from '../utils';
import Ripple, {RippleProps} from './Ripple';

const DEFAULT_EXTRA_RIPPLE_RADII = 5;

// ## <section id='props'>Props</section>
export type CheckboxProps = {
  // Color of the border (outer circle), when checked
  borderOnColor?: string,

  // Color of the border (outer circle), when unchecked
  borderOffColor?: string,

  // Toggle status
  checked?: boolean,

  // Callback when the toggle status is changed
  onCheckedChange?: CheckedListener,

  // How far the ripple can extend outside the Checkbox's border,
  // default is 5
  extraRippleRadius?: number,

  // Toggle Editable
  editable?: boolean,
} & TickProps & RippleProps & TouchableWithoutFeedbackProps;

interface CheckboxState {
  checked: boolean
  width: number
  height: number
  rippleRadii: number
}

//
// ## <section id='Checkbox'>Checkbox</section>
// The `Checkbox` component.
export default class Checkbox extends Component<CheckboxProps, CheckboxState> {
  // ## <section id='defaults'>Defaults</section>
  static defaultProps: CheckboxProps = {
    checked: false,
    editable: true,
    maskColor: MKColor.Transparent,
    pointerEvents: 'box-only',

    style: {
      height: 20,
      width: 20,
      overflow: "hidden", // To fix the Android overflow issue on Android SDK 26
      alignItems: 'center',
      borderRadius: 1,
      borderWidth: 2,
      justifyContent: 'center',
    },
  };

  private theme = getTheme();
  private animatedTickAlpha = new Animated.Value(0);

  constructor(props: CheckboxProps) {
    super(props);
    this.state = {
      checked: false,
      height: 0,
      rippleRadii: 0,
      width: 0,
    };
  }

  componentWillMount() {
    this.initView(this.props.checked);
  }

  // componentWillReceiveProps(nextProps: CheckboxProps) {
  //   if (nextProps.checked !== this.props.checked) {
  //     this.initView(nextProps.checked);
  //   }
  // }
  
  // On iPhone X - iOS 12, at times the checkbox doesn't changes it's state. This 
  // will fix that. EDIT : 29/03/2019 - Apparently the last one was only half a fix
  // so added another condition to fix it.
  // EDIT : 30/04/2019 - There was a problem with the condition that was applied in
  // #410. It was not allowing the component to change it's state when prop was
  // changing after the state. Fixed it.
  componentDidUpdate(prevProps: CheckboxProps, prevState: CheckboxState) {
    if (prevProps.checked !== this.props.checked ||
        prevState.checked !== this.state.checked){
      this._initView(this.props.checked);
    }
  }

  render() {
    const defaultStyle = this.theme.checkboxStyle;
    const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, [
      'borderOnColor',
      'borderOffColor',
      'fillColor',
      'rippleColor',
      'inset',
    ])) as CheckboxProps;
    const borderColor = this.state.checked ? mergedStyle.borderOnColor : mergedStyle.borderOffColor;

    return (
      <TouchableWithoutFeedback {...utils.extractTouchableProps(this)}>
        <Ripple
          {...this.props}
          maskBorderRadiusInPercent={50}
          rippleLocation="center"
          rippleColor={mergedStyle.rippleColor}
          onTouch={this.onTouch}
          style={{
            alignItems: 'center',
            height: this.state.height,
            justifyContent: 'center',
            width: this.state.width,
          }}
        >
          <View
            style={[
              Checkbox.defaultProps.style,
              this.props.style,
              {
                alignItems: 'stretch',
                borderColor,
              },
            ]}
            onLayout={this.onLayout}
          >
            <AnimatedTick
              inset={mergedStyle.inset}
              fillColor={mergedStyle.fillColor}
              style={{
                flex: 1,
                opacity: this.animatedTickAlpha,
              }}
            />
          </View>
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }

  private initView(checked: boolean = false) {
    this.setState({checked});
    this.aniToggle(checked);
  }

  private onLayout = ({nativeEvent: {layout: {width, height}}}: LayoutChangeEvent) => {
    if (width === this.state.width && height === this.state.height) {
      return;
    }

    const size = Math.min(width, height);
    const rippleRadii = size * Math.SQRT2 / 2 + (this.props.extraRippleRadius
      || DEFAULT_EXTRA_RIPPLE_RADII);
    this.setState({
      rippleRadii,

      height: rippleRadii * 2,
      width: rippleRadii * 2,
    });
  };

  // Touch events handling
  private onTouch = ({type}: TouchEvent) => {
    if (type === 'TOUCH_UP' && this.props.editable) {
      this.confirmToggle();
    }
  };

  // animate the checked state, by scaling the inner circle
  private aniToggle(checked: boolean) {
    Animated.timing(this.animatedTickAlpha, {
      duration: 220,
      toValue: checked ? 1 : 0,
    }).start();
  }

  // When a toggle action (from the given state) is confirmed.
  private confirmToggle() {
    const prevState = this.state.checked;
    const newState = !prevState;

    this.setState({ checked: newState }, () => {
      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({ checked: this.state.checked });
      }
    });

    this.aniToggle(newState);
  }
}
