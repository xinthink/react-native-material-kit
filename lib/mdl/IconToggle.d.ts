/**
 * MDL-style Icon Toggle component.
 *
 * See {@link https://getmdl.io/components/index.html#toggles-section/icon-toggle | MDL Icon Toggle}
 *
 * Created by ywu on 15/10/07.
 */
import { Component } from 'react';
import { TouchableWithoutFeedbackProps } from 'react-native';
import { CheckedListener } from '../types';
import { RippleProps } from './Ripple';
/** Props of {@link IconToggle} */
export interface IconToggleProps extends RippleProps, TouchableWithoutFeedbackProps {
    enabled?: boolean;
    /** Toggle status */
    checked?: boolean;
    /** Callback when the toggle status is changed */
    onCheckedChange?: CheckedListener;
}
/** Props of {@link IconToggle} */
interface IconToggleState {
    checked: boolean;
}
/**
 * The `IconToggle` component.
 *
 * See {@link https://getmdl.io/components/index.html#toggles-section/icon-toggle | MDL implementation}
 */
export default class IconToggle extends Component<IconToggleProps, IconToggleState> {
    /** Default props */
    static defaultProps: IconToggleProps;
    private theme;
    constructor(props: IconToggleProps);
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: IconToggleProps): void;
    render(): JSX.Element;
    /**
     * Select a child element to show for the current toggle status.
     * @see [State List](http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList) in Android development
     */
    private renderChildren;
    /** Touch event handler */
    private onTouch;
    /** When a toggle action (from the given state) is confirmed. */
    private confirmToggle;
}
export {};
//# sourceMappingURL=IconToggle.d.ts.map