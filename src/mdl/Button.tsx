/**
 * MDL-style Button component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#buttons-section | MDL Button} .
 *
 * Created by ywu on 15/7/2.
 */
import React, { Component, SFC } from 'react';
import {
  LayoutChangeEvent,
  TextStyle,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';

import MKColor from '../MKColor';
import { AttrValue, getTheme, Theme } from '../theme';
import * as utils from '../utils';
import Ripple, { RippleProps } from './Ripple';

/** Props of {@link Button}, which extends {@link RippleProps} and {@link @types/react-native#TouchableWithoutFeedbackProps | TouchableWithoutFeedbackProps} */
export interface ButtonProps extends TouchableWithoutFeedbackProps, RippleProps {
  /**
   * Whether this's a FAB.
   * @defaultValue `false`
   */
  fab?: boolean;

  /**
   * Whether the button is enabled.
   * @defaultValue `true`
   */
  enabled?: boolean;
}

/**
 * State of {@link Button}
 * @internal
 */
interface ButtonState {
  width: number;
  height: number;
}

/**
 * Default props, see {@link Button.defaultProps}
 */
const defaultProps: ButtonProps = {
  ...Ripple.defaultProps,
  enabled: true,
  fab: false,
  pointerEvents: 'box-only',
};

// (Most of them are defined as functions, in order to lazy-resolve the theme)
// default button props
const defaultStyle: ButtonProps = {
  style: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
};

/**
 * The `Button` component.
 *
 * @remarks
 * With configurable shadow, ripple effect, and FAB style. See {@link ButtonProps} for the available props.
 *
 * Refer to {@link https://material.io/design/components/buttons.html# | Guideline} or {@link https://getmdl.io/components/index.html#buttons-section | MDL implementation}
 */
export default class Button extends Component<ButtonProps, ButtonState> {
  /** Default props */
  static defaultProps: ButtonProps = defaultProps;

  /** Reference to App's {@link Theme} */
  private theme: Theme;

  constructor(props: ButtonProps) {
    super(props);
    this.theme = getTheme();
    this.state = {
      height: 0,
      width: 0,
    };
  }

  /** {@inheritDoc @types/react#Component.render} */
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
        <Ripple {...this.props} {...maskProps} style={[this.props.style, fabStyle]} />
      </TouchableWithoutFeedback>
    );
  }

  /** `onLayout` handler */
  private _onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }: LayoutChangeEvent) => {
    if (width !== this.state.width || height !== this.state.height) {
      this.setState({
        height,
        width,
      });
    }
  };
}

/** Default raised button */
export const RaisedButton: SFC<ButtonProps> = props => customizedButton(raisedButton(), props);

/** Primary raised button */
export const ColoredRaisedButton: SFC<ButtonProps> = props =>
  customizedButton(coloredRaisedButton(), props);

/** Raised button with Accent color */
export const AccentRaisedButton: SFC<ButtonProps> = props =>
  customizedButton(accentRaisedButton(), props);

/** Flat button (text button) */
export const FlatButton: SFC<ButtonProps> = props => customizedButton(flatButton(), props);

/** Default floating action button */
export const Fab: SFC<ButtonProps> = props => customizedButton(fab(), props);

/** Primary floating action button */
export const ColoredFab: SFC<ButtonProps> = props => customizedButton(coloredFab(), props);

/** Accent colored floating action button */
export const AccentFab: SFC<ButtonProps> = props => customizedButton(accentFab(), props);

// Factory method to create a button variance
function customizedButton(
  { style: baseStyle, ...baseProps }: ButtonProps,
  { style: customStyle, ...customProps }: ButtonProps
): JSX.Element {
  return <Button {...baseProps} {...customProps} style={[baseStyle, customStyle]} />;
}

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
function coloredRaisedButton(
  theme = getTheme(),
  backgroundColor: AttrValue = theme.primaryColor
): ButtonProps {
  const { style, ...props } = defaultStyle;
  return {
    ...props,
    style: [
      style,
      {
        backgroundColor: backgroundColor as string,
        borderRadius: 2,
        elevation: 4,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.7,
        shadowRadius: 1,
      },
    ],
  };
}

function accentRaisedButton(theme = getTheme()): ButtonProps {
  return coloredRaisedButton(theme, theme.accentColor);
}

function flatButton(theme = getTheme(), rippleColor: AttrValue = theme.bgPlain): ButtonProps {
  const { style, ...props } = defaultStyle;
  return {
    ...props,
    maskColor: rippleColor as string,
    rippleColor: rippleColor as string,
    shadowAniEnabled: false,
    style: [
      style,
      {
        backgroundColor: MKColor.Transparent,
        borderRadius: 2,
      },
    ],
  };
}

function coloredFab(
  theme = getTheme(),
  backgroundColor: AttrValue = theme.primaryColor
): ButtonProps {
  const { style, ...props } = defaultStyle;
  return {
    ...props,
    rippleLocation: 'center',
    style: [
      style,
      {
        backgroundColor: backgroundColor as string,
        elevation: 4,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.4,
        shadowRadius: 1,

        borderRadius: 24,
        height: 48,
        width: 48,
      },
    ],
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

/** Pre-defined Button props/styles for common cases */
export const ButtonStyles = {
  buttonText,
  buttonTextAccent,
  buttonTextPrimary,
  coloredButtonText,
};
