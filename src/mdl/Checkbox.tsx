//
// MDL-style Checkbox component.
//
// - @see [MDL Checkbox](http://www.getmdl.io/components/index.html#toggles-section/checkbox)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/12/13.
//

import React, { Component } from 'react';
import {
  Animated,
  LayoutChangeEvent, Text,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';

import { TouchEvent } from '../internal/MKTouchable';
import { AnimatedTick, TickProps } from '../internal/Tick';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
import { CheckedListener } from '../types';
import * as utils from '../utils';
import Ripple, { RippleProps } from './Ripple';

const DEFAULT_EXTRA_RIPPLE_RADII = 5;

/**
 * ## <section id='props'>Props</section>
 * @public
 */
export type CheckboxProps = {
  // Color of the border (outer circle), when checked
  borderOnColor?: string;

  // Color of the border (outer circle), when unchecked
  borderOffColor?: string;

  // Toggle status
  checked?: boolean;

  // Callback when the toggle status is changed
  onCheckedChange?: CheckedListener;

  // How far the ripple can extend outside the Checkbox's border,
  // default is 5
  extraRippleRadius?: number;

  // Toggle Editable
  editable?: boolean;
} & TickProps &
  RippleProps &
  TouchableWithoutFeedbackProps;

interface CheckboxState {
  checked: boolean;
  width: number;
  height: number;
  rippleRadii: number;
}

const defaultProps: CheckboxProps = {
  checked: false,
  editable: true,
  maskColor: MKColor.Transparent,
  pointerEvents: 'box-only',

  style: {
    height: 20,
    width: 20,

    alignItems: 'center',
    borderRadius: 1,
    borderWidth: 2,
    justifyContent: 'center',
    overflow: 'hidden', // To fix the Android overflow issue on Android SDK 26
  },
};

/**
 * The `Checkbox` component.
 */
export default class Checkbox extends Component<CheckboxProps, CheckboxState> {
  // ## <section id='defaults'>Defaults</section>
  static defaultProps: CheckboxProps = defaultProps;

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

  UNSAFE_componentWillMount() {
    this.initView(this.props.checked);
  }

  /**
   * TODO using controlled components.
   * @see https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html?#preferred-solutions
   */
  UNSAFE_componentWillReceiveProps(nextProps: CheckboxProps) {
    if (nextProps.checked !== this.props.checked && nextProps !== this.state.checked) {
      this.initView(nextProps.checked || false);
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
              defaultProps.style,
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
    this.setState({ checked });
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
