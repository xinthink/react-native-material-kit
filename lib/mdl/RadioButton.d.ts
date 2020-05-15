/**
 * MDL-style Radio button component.
 *
 * See [MDL Radio Button](http://www.getmdl.io/components/index.html#toggles-section/radio)
 *
 * Created by ywu on 15/10/12.
 */
import { Component } from 'react';
import { TouchableWithoutFeedbackProps } from 'react-native';
import { CheckedListener } from '../types';
import Group from './RadioButtonGroup';
import { RippleProps } from './Ripple';
/** Props of {@link RadioButton} */
export interface RadioButtonProps extends RippleProps, TouchableWithoutFeedbackProps {
    borderOnColor?: string;
    borderOffColor?: string;
    fillColor?: string;
    checked?: boolean;
    group?: Group;
    onCheckedChange?: CheckedListener;
    extraRippleRadius?: number;
}
/** State of {@link RadioButton} */
interface RadioButtonState {
    checked: boolean;
    height: number;
    width: number;
}
/**
 * The `RadioButton` component.
 *
 * @remarks
 * See {@link https://material.io/components/selection-controls/#radio-buttons | Guideline} & {@link http://www.getmdl.io/components/index.html#toggles-section/radio | MDL implementation}
 */
export default class RadioButton extends Component<RadioButtonProps, RadioButtonState> {
    /** Default props */
    static defaultProps: RadioButtonProps;
    private theme;
    private animatedSize;
    private animatedRadius;
    private group?;
    constructor(props: RadioButtonProps);
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: RadioButtonProps): void;
    componentWillUnmount(): void;
    confirmToggle(): void;
    confirmUncheck(): void;
    render(): JSX.Element;
    private initView;
    private emitCheckedChange;
    /** animate the checked state, by scaling the inner circle */
    private aniChecked;
    /** Layout event handler */
    private onLayout;
    /** Touch event handler */
    private onTouch;
}
export {};
//# sourceMappingURL=RadioButton.d.ts.map