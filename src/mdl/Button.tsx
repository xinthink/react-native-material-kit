//
// MDL-style Button component.
//
// - @see [MDL Button](http://www.getmdl.io/components/index.html#buttons-section)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/7/2.
//

import React, {Component, SFC} from 'react'

import {
  LayoutChangeEvent,
  TextStyle,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native'

import MKColor from '../MKColor'
import {AttrValue, getTheme, Theme} from '../theme'
import * as utils from '../utils'
import Ripple, {RippleProps} from './Ripple'

// ## <section id='props'>ButtonProps</section>
export interface ButtonProps extends TouchableWithoutFeedbackProps, RippleProps {
  // Whether this's a FAB
  fab?: boolean

  // Whether the button is enabled
  enabled?: boolean
}

interface ButtonState {
  width: number
  height: number
}


//
// ## <section id='Button'>Button</section>
// The `Button` component. With configurable shadow, ripple effect, and FAB style.
//
export default class Button extends Component<ButtonProps, ButtonState> {

  // ## <section id='defaults'>Defaults</section>
  static defaultProps: ButtonProps = {
    // [Ripple defaults](Ripple.html#defaults)...
    ...Ripple.defaultProps,
    enabled: true,
    fab: false,
    pointerEvents: 'box-only',
  };

  theme: Theme;

  constructor(props: ButtonProps) {
    super(props);
    this.theme = getTheme();
    this.state = {
      height: 0,
      width: 0,
    };
  }

  _onLayout = ({nativeEvent: {layout: {width, height}}}: LayoutChangeEvent) => {
    if (width !== this.state.width || height !== this.state.height) {
      this.setState({
        height,
        width,
      });
    }
  };

  render() {
    const touchableProps: TouchableWithoutFeedbackProps = {};
    if (this.props.enabled) {
      Object.assign(touchableProps, utils.extractTouchableProps(this));
    }

    // fix #57 applying `onLayout` to <Ripple>, <TouchableXXX> clones `onLayout` to it's child
    touchableProps.onLayout = this._onLayout;

    const fabStyle: TextStyle = {};
    const maskProps: RippleProps = {};

    if (this.props.fab) {
      maskProps.maskBorderRadiusInPercent = 50;

      if (this.state.width > 0 || this.state.height > 0) {
        let size = Math.min(this.state.width, this.state.height);
        if (!size || size <= 0) {
          size = Math.max(this.state.width, this.state.height);
        }

        fabStyle.width = size;
        fabStyle.height = size;
        fabStyle.borderRadius = size / 2;
      }
    }

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <Ripple
          {...this.props}
          {...maskProps}
          style={[
            this.props.style,
            fabStyle,
          ]}
        />
      </TouchableWithoutFeedback>
    );
  }
}

// --------------------------
// Pre-defined button variances.
export const RaisedButton: SFC<ButtonProps> = props =>
  customizedButton(raisedButton(), props);

export const ColoredRaisedButton: SFC<ButtonProps> = props =>
  customizedButton(coloredRaisedButton(), props);

export const AccentRaisedButton: SFC<ButtonProps> = props =>
  customizedButton(accentRaisedButton(), props);

export const FlatButton: SFC<ButtonProps> = props =>
  customizedButton(flatButton(), props);

export const Fab: SFC<ButtonProps> = props =>
  customizedButton(fab(), props);

export const ColoredFab: SFC<ButtonProps> = props =>
  customizedButton(coloredFab(), props);

export const AccentFab: SFC<ButtonProps> = props =>
  customizedButton(accentFab(), props);

// Factory method to create a button variance
function customizedButton(
  {style: baseStyle, ...baseProps}: ButtonProps,
  {style: customStyle, ...customProps}: ButtonProps
): JSX.Element {
  return <Button
    {...baseProps}
    {...customProps}
    style={[baseStyle, customStyle]}
  />;
}

// (Most of them are defined as functions, in order to lazy-resolve the theme)
// default button props
const button: ButtonProps = {
  style: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
};

// Text style for buttons, default color is `black`
function buttonText(theme = getTheme(), color: AttrValue = 'black'): TextStyle {
  return {
    color: color as string, // AttrValue resolved to string or number when retrieved from a Theme
    fontSize: theme.fontSize as number,
    fontWeight: 'bold',
  };
}

// Text style for colored buttons
function coloredButtonText(theme = getTheme()): TextStyle {
  return buttonText(theme, 'white');
}

// Text style using primary color
function buttonTextPrimary(theme = getTheme()): TextStyle {
  return buttonText(theme, theme.primaryColor);
}

// Text style using accent color
function buttonTextAccent(theme = getTheme()): TextStyle {
  return buttonText(theme, theme.accentColor);
}

// Props for default raised button
function raisedButton(theme = getTheme()): ButtonProps {
  return {
    ...coloredRaisedButton(theme, MKColor.Silver),
    maskColor: theme.bgPlain as string,
    rippleColor: theme.bgPlain as string,
  };
}

// Props for colored raised button
function coloredRaisedButton(theme = getTheme(),
                             backgroundColor: AttrValue = theme.primaryColor): ButtonProps {
  const {style, ...props} = button;
  return {
    ...props,
    style: [style, {
      backgroundColor: backgroundColor as string,
      borderRadius: 2,
      elevation: 4,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 0.5},
      shadowOpacity: 0.7,
      shadowRadius: 1,
    }],
  };
}

function accentRaisedButton(theme = getTheme()): ButtonProps {
  return coloredRaisedButton(theme, theme.accentColor);
}

function flatButton(theme = getTheme(),
                    rippleColor: AttrValue = theme.bgPlain): ButtonProps {
  const {style, ...props} = button;
  return {
    ...props,
    maskColor: rippleColor as string,
    rippleColor: rippleColor as string,
    shadowAniEnabled: false,
    style: [style, {
      backgroundColor: MKColor.Transparent,
      borderRadius: 2,
    }],
  };
}

function coloredFab(theme = getTheme(),
                    backgroundColor: AttrValue = theme.primaryColor): ButtonProps {
  const {style, ...props} = button;
  return {
    ...props,
    rippleLocation: 'center',
    style: [style, {
      backgroundColor: backgroundColor as string,
      elevation: 4,
      shadowColor: 'black',
      shadowOffset: {width: 0, height: 0.5},
      shadowOpacity: 0.4,
      shadowRadius: 1,

      borderRadius: 24,
      height: 48,
      width: 48,
    }],
  };
}

function accentFab(theme = getTheme()): ButtonProps {
  return coloredFab(theme, theme.accentColor);
}

function fab(theme = getTheme()): ButtonProps {
  return {
    ...coloredFab(theme, MKColor.Silver),
    maskColor: theme.bgPlain as string,
    rippleColor: theme.bgPlain as string,
  };
}

// Pre-defined Button props/styles for common cases
export const ButtonStyles = {
  buttonText,
  buttonTextAccent,
  buttonTextPrimary,
  coloredButtonText,
};
