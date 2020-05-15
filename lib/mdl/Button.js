var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * MDL-style Button component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#buttons-section | MDL Button} .
 *
 * Created by ywu on 15/7/2.
 */
import React, { Component } from 'react';
import { TouchableWithoutFeedback, } from 'react-native';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
import * as utils from '../utils';
import Ripple from './Ripple';
/**
 * Default props, see {@link Button.defaultProps}
 */
const defaultProps = Object.assign({}, Ripple.defaultProps, { enabled: true, fab: false, pointerEvents: 'box-only' });
// default button props
const defaultStyle = {
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
export default class Button extends Component {
    constructor(props) {
        super(props);
        /** `onLayout` handler */
        this._onLayout = ({ nativeEvent: { layout: { width, height }, }, }) => {
            if (width !== this.state.width || height !== this.state.height) {
                this.setState({
                    height,
                    width,
                });
            }
        };
        this.theme = getTheme();
        this.state = {
            height: 0,
            width: 0,
        };
    }
    /** {@inheritDoc @types/react#Component.render} */
    render() {
        const touchableProps = {};
        if (this.props.enabled) {
            Object.assign(touchableProps, utils.extractTouchableProps(this));
        }
        // fix #57 applying `onLayout` to <Ripple>, <TouchableXXX> clones `onLayout` to it's child
        touchableProps.onLayout = this._onLayout;
        const fabStyle = {};
        const maskProps = {};
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
        return (<TouchableWithoutFeedback {...touchableProps}>
        <Ripple {...this.props} {...maskProps} style={[this.props.style, fabStyle]}/>
      </TouchableWithoutFeedback>);
    }
}
/** Default props */
Button.defaultProps = defaultProps;
/** Default raised button */
export const RaisedButton = props => customizedButton(raisedButton(), props);
/** Primary raised button */
export const ColoredRaisedButton = props => customizedButton(coloredRaisedButton(), props);
/** Raised button with Accent color */
export const AccentRaisedButton = props => customizedButton(accentRaisedButton(), props);
/** Flat button (text button) */
export const FlatButton = props => customizedButton(flatButton(), props);
/** Default floating action button */
export const Fab = props => customizedButton(fab(), props);
/** Primary floating action button */
export const ColoredFab = props => customizedButton(coloredFab(), props);
/** Accent colored floating action button */
export const AccentFab = props => customizedButton(accentFab(), props);
/** Factory method to create a button variance */
function customizedButton(_a, _b) {
    var { style: baseStyle } = _a, baseProps = __rest(_a, ["style"]);
    var { style: customStyle } = _b, customProps = __rest(_b, ["style"]);
    return <Button {...baseProps} {...customProps} style={[baseStyle, customStyle]}/>;
}
/** Text style for buttons, default color is `black` */
function buttonText(theme = getTheme(), color = 'black') {
    return {
        color: color,
        fontSize: theme.fontSize,
        fontWeight: 'bold',
    };
}
/** Text style for colored buttons */
function coloredButtonText(theme = getTheme()) {
    return buttonText(theme, 'white');
}
/** Text style using primary color */
function buttonTextPrimary(theme = getTheme()) {
    return buttonText(theme, theme.primaryColor);
}
/** Text style using accent color */
function buttonTextAccent(theme = getTheme()) {
    return buttonText(theme, theme.accentColor);
}
/** Props for a default raised button */
function raisedButton(theme = getTheme()) {
    return Object.assign({}, coloredRaisedButton(theme, MKColor.Silver), { maskColor: theme.bgPlain, rippleColor: theme.bgPlain });
}
/** Props for a colored raised button */
function coloredRaisedButton(theme = getTheme(), backgroundColor = theme.primaryColor) {
    const { style } = defaultStyle, props = __rest(defaultStyle, ["style"]);
    return Object.assign({}, props, { style: [
            style,
            {
                backgroundColor: backgroundColor,
                borderRadius: 2,
                elevation: 4,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: 0.7,
                shadowRadius: 1,
            },
        ] });
}
/** Props for an accent-colored raised button */
function accentRaisedButton(theme = getTheme()) {
    return coloredRaisedButton(theme, theme.accentColor);
}
/** Props for a default flat button */
function flatButton(theme = getTheme(), rippleColor = theme.bgPlain) {
    const { style } = defaultStyle, props = __rest(defaultStyle, ["style"]);
    return Object.assign({}, props, { maskColor: rippleColor, rippleColor: rippleColor, shadowAniEnabled: false, style: [
            style,
            {
                backgroundColor: MKColor.Transparent,
                borderRadius: 2,
            },
        ] });
}
/** Props for a colored floating action button */
function coloredFab(theme = getTheme(), backgroundColor = theme.primaryColor) {
    const { style } = defaultStyle, props = __rest(defaultStyle, ["style"]);
    return Object.assign({}, props, { rippleLocation: 'center', style: [
            style,
            {
                backgroundColor: backgroundColor,
                elevation: 4,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 0.5 },
                shadowOpacity: 0.4,
                shadowRadius: 1,
                borderRadius: 24,
                height: 48,
                width: 48,
            },
        ] });
}
/** Props for an accent-colored floating action button */
function accentFab(theme = getTheme()) {
    return coloredFab(theme, theme.accentColor);
}
/** Props for a default floating action button */
function fab(theme = getTheme()) {
    return Object.assign({}, coloredFab(theme, MKColor.Silver), { maskColor: theme.bgPlain, rippleColor: theme.bgPlain });
}
/** Pre-defined Button props/styles for common cases */
export const ButtonStyles = {
    buttonText,
    buttonTextAccent,
    buttonTextPrimary,
    coloredButtonText,
};
//# sourceMappingURL=Button.js.map