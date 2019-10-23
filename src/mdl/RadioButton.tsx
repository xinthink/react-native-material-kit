//
// MDL-style Radio button component.
//
// - @see [MDL Radio Button](http://www.getmdl.io/components/index.html#toggles-section/radio)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/10/12.
//

import React, { Component } from 'react';

import {
  Animated,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';

import { TouchEvent } from '../internal/MKTouchable';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
import { CheckedListener } from '../types';
import * as utils from '../utils';
import Group from './RadioButtonGroup';
import Ripple, { RippleProps } from './Ripple';

const DEFAULT_EXTRA_RIPPLE_RADII = 16;

// ## <section id='props'>Props</section>
export type RadioButtonProps = {
  // Color of the border (outer circle), when checked
  borderOnColor?: string;

  // Color of the border (outer circle), when unchecked
  borderOffColor?: string;

  // Color of the inner circle, when checked
  fillColor?: string;

  // Toggle status
  checked?: boolean;

  // Group to which the Radio button belongs
  group?: Group;

  // Callback when the toggle status is changed
  onCheckedChange?: CheckedListener;

  // How far the ripple can extend outside the RadioButton's border,
  // default is 16
  extraRippleRadius?: number;
} & RippleProps &
  TouchableWithoutFeedbackProps;

interface RadioButtonState {
  checked: boolean;
  height: number;
  width: number;
}

const defaultProps: RadioButtonProps = {
  maskColor: MKColor.Transparent,
  pointerEvents: 'box-only',
  style: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
};

//
// ## <section id='RadioButton'>RadioButton</section>
// The `RadioButton` component.
export default class RadioButton extends Component<RadioButtonProps, RadioButtonState> {
  // ## <section id='defaults'>Defaults</section>
  static defaultProps: RadioButtonProps = defaultProps;

  private theme = getTheme();
  private animatedSize = new Animated.Value(0);
  private animatedRadius = new Animated.Value(0);
  private group?: Group;

  constructor(props: RadioButtonProps) {
    super(props);

    this.state = {
      checked: false,
      height: 0,
      width: 0,
    };
  }

  UNSAFE_componentWillMount() {
    this.group = this.props.group;
    this.initView(this.props.checked);
    this.group && this.group.add(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: RadioButtonProps) {
    if (this.group !== nextProps.group) {
      this.group && this.group.remove(this);
      this.group = nextProps.group;
      this.group && this.group.add(this);
    }

    if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
      this.initView(nextProps.checked);
    }
  }

  componentWillUnmount() {
    this.group && this.group.remove(this);
  }

  // When a toggle action (from the given state) is confirmed.
  confirmToggle() {
    const prevState = this.state.checked;
    const newState = !prevState;

    this.setState({checked: newState},
      () => this.emitCheckedChange(newState));

    // update state of the other buttons in the group
    this.group && this.group.onChecked(this, newState);

    this.aniChecked(newState);
  }

  confirmUncheck() {
    this.setState({checked: false},
      () => this.emitCheckedChange(false));
    this.aniChecked(false);
  }

  render() {
    const defaultStyle = this.theme.radioStyle;
    const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, [
      'borderOnColor',
      'borderOffColor',
      'fillColor',
      'rippleColor',
    ])) as RadioButtonProps;
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
              {borderColor},
              this.props.style,
            ]}
            onLayout={this.onLayout}
          >
            <Animated.View
              style={{
                backgroundColor: mergedStyle.fillColor,
                borderRadius: this.animatedRadius,
                height: this.animatedSize,
                width: this.animatedSize,
              }}
            />
          </View>
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }

  private initView(checked: boolean = false) {
    this.setState({ checked });
    this.aniChecked(checked);
  }

  private emitCheckedChange(checked: boolean) {
    this.props.onCheckedChange && this.props.onCheckedChange({ checked });
  }

  // animate the checked state, by scaling the inner circle
  private aniChecked(checked: boolean) {
    Animated.parallel([
      Animated.timing(this.animatedRadius, {
        duration: 220,
        toValue: checked ? 5 : 0,
      }),
      Animated.timing(this.animatedSize, {
        duration: 220,
        toValue: checked ? 10 : 0,
      }),
    ]).start();
  }

  private onLayout = ({nativeEvent: {layout: {width, height}}}: LayoutChangeEvent) => {
    if (width === this.state.width && height === this.state.height) {
      return;
    }

    const padding = this.props.extraRippleRadius || DEFAULT_EXTRA_RIPPLE_RADII;
    this.setState({
      height: height + padding,
      width: width + padding,
    });
  };

  // Touch events handling
  private onTouch = ({ type }: TouchEvent) => {
    if (type === 'TOUCH_UP') {
      if (!this.state.checked) {
        this.confirmToggle();
      }
    }
  };
}
