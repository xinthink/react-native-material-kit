/**
 * MDL-style Button component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#buttons-section | MDL Button} .
 *
 * Created by ywu on 15/7/2.
 */
import { Component, SFC } from 'react';
import { TextStyle, TouchableWithoutFeedbackProps } from 'react-native';
import { AttrValue, Theme } from '../theme';
import { RippleProps } from './Ripple';
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
 * The `Button` component.
 *
 * @remarks
 * With configurable shadow, ripple effect, and FAB style. See {@link ButtonProps} for the available props.
 *
 * Refer to {@link https://material.io/design/components/buttons.html# | Guideline} or {@link https://getmdl.io/components/index.html#buttons-section | MDL implementation}
 */
export default class Button extends Component<ButtonProps, ButtonState> {
    /** Default props */
    static defaultProps: ButtonProps;
    /** Reference to App's {@link Theme} */
    private theme;
    constructor(props: ButtonProps);
    /** {@inheritDoc @types/react#Component.render} */
    render(): JSX.Element;
    /** `onLayout` handler */
    private _onLayout;
}
/** Default raised button */
export declare const RaisedButton: SFC<ButtonProps>;
/** Primary raised button */
export declare const ColoredRaisedButton: SFC<ButtonProps>;
/** Raised button with Accent color */
export declare const AccentRaisedButton: SFC<ButtonProps>;
/** Flat button (text button) */
export declare const FlatButton: SFC<ButtonProps>;
/** Default floating action button */
export declare const Fab: SFC<ButtonProps>;
/** Primary floating action button */
export declare const ColoredFab: SFC<ButtonProps>;
/** Accent colored floating action button */
export declare const AccentFab: SFC<ButtonProps>;
/** Text style for buttons, default color is `black` */
declare function buttonText(theme?: Theme, color?: AttrValue): TextStyle;
/** Text style for colored buttons */
declare function coloredButtonText(theme?: Theme): TextStyle;
/** Text style using primary color */
declare function buttonTextPrimary(theme?: Theme): TextStyle;
/** Text style using accent color */
declare function buttonTextAccent(theme?: Theme): TextStyle;
/** Pre-defined Button props/styles for common cases */
export declare const ButtonStyles: {
    buttonText: typeof buttonText;
    buttonTextAccent: typeof buttonTextAccent;
    buttonTextPrimary: typeof buttonTextPrimary;
    coloredButtonText: typeof coloredButtonText;
};
export {};
//# sourceMappingURL=Button.d.ts.map