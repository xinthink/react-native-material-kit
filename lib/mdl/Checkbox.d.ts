/**
 * MDL-style Checkbox component.
 *
 * See {@link http://www.getmdl.io/components/index.html#toggles-section/checkbox | MDL Checkbox}
 *
 * Created by ywu on 15/12/13.
 */
import { Component } from 'react';
import { TouchableWithoutFeedbackProps } from 'react-native';
import { TickProps } from '../internal/Tick';
import { CheckedListener } from '../types';
import { RippleProps } from './Ripple';
/** Props of {@link Checkbox} */
export declare type CheckboxProps = {
    /** Color of the border (outer circle), when checked */
    borderOnColor?: string;
    /** Color of the border (outer circle), when unchecked */
    borderOffColor?: string;
    /** Toggle status */
    checked?: boolean;
    /** Callback when the toggle status is changed */
    onCheckedChange?: CheckedListener;
    /** How far the ripple can extend outside the Checkbox's border, `5` by default */
    extraRippleRadius?: number;
    /** Toggle Editable */
    editable?: boolean;
} & TickProps & RippleProps & TouchableWithoutFeedbackProps;
/** State of {@link Checkbox} */
interface CheckboxState {
    checked: boolean;
    width: number;
    height: number;
    rippleRadii: number;
}
/**
 * The `Checkbox` component.
 *
 * @remarks
 * See {@link https://material.io/components/selection-controls/#checkboxes | Guideline} & {@link http://www.getmdl.io/components/index.html#toggles-section/checkbox | MDL implementation}
 */
export default class Checkbox extends Component<CheckboxProps, CheckboxState> {
    /** Default props */
    static defaultProps: CheckboxProps;
    private theme;
    private animatedTickAlpha;
    constructor(props: CheckboxProps);
    UNSAFE_componentWillMount(): void;
    /**
     * TODO using controlled components.
     * @see https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html?#preferred-solutions
     */
    UNSAFE_componentWillReceiveProps(nextProps: CheckboxProps): void;
    render(): JSX.Element;
    private initView;
    /** Layout event handler */
    private onLayout;
    /** Touch event handler */
    private onTouch;
    /** animate the checked state, by scaling the inner circle */
    private aniToggle;
    /** When a toggle action (from the given state) is confirmed. */
    private confirmToggle;
}
export {};
//# sourceMappingURL=Checkbox.d.ts.map