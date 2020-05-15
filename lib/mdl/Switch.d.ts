/**
 * MDL style switch component.
 *
 * <image src="http://bit.ly/1OF6Z96" width="400"/>
 *
 * See {@link http://bit.ly/1IcHMPo | MDL Switch}
 *
 * Created by ywu on 15/7/28.
 */
import { Component } from 'react';
import { TouchableWithoutFeedbackProps } from 'react-native';
import { CheckedListener } from '../types';
/** Props of {@link Switch} */
export interface SwitchProps extends TouchableWithoutFeedbackProps {
    /** Toggle status of the `Switch` */
    checked?: boolean;
    /** Callback when the toggle status is changed. */
    onCheckedChange?: CheckedListener;
    /** Color of the track, when switch is checked */
    onColor?: string;
    /** Color of the track, when switch is off */
    offColor?: string;
    /** The thickness of the Switch track */
    trackSize?: number;
    /** The length of the Switch track */
    trackLength?: number;
    /** Radius of the thumb button */
    thumbRadius?: number;
    /** Color of the thumb, when switch is checked */
    thumbOnColor?: string;
    /** Color of the thumb, when switch is off */
    thumbOffColor?: string;
    /** Duration of the thumb sliding animation, in milliseconds */
    thumbAniDuration?: number;
    /** Color of the ripple layer */
    rippleColor?: string;
    /** Duration of the ripple effect, in milliseconds */
    rippleAniDuration?: number;
}
/** State of {@link Switch} */
interface SwitchState {
    checked: boolean;
    thumbFrame: {
        padding: number;
        r: number;
        rippleRadii: number;
        x: number;
    };
    trackLength: number;
    trackMargin: number;
    trackRadii: number;
    trackSize: number;
}
/**
 * The `Switch` component.
 *
 * @remarks
 * Which is made up of a `Track` and a {@link Thumb}.
 *
 * See {@link https://material.io/components/selection-controls/#switches | Guideline} & {@link http://bit.ly/1IcHMPo | MDL implementation}
 */
export default class Switch extends Component<SwitchProps, SwitchState> {
    /** Default props */
    static defaultProps: SwitchProps;
    private theme;
    private thumbRef;
    private animatedThumbLeft;
    constructor(props: SwitchProps);
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: SwitchProps): void;
    /** {@inheritDoc @types/react#Component.render} */
    render(): JSX.Element;
    /**
     * Un-boxing the `Thumb` node from `AnimatedComponent`,
     * in order to access the component functions defined in `Thumb`
     */
    private readonly thumb;
    private getBgColor;
    private onPress;
    private onPressIn;
    private onPressOut;
    /** Layout the thumb according to the size of the track */
    private layoutThumb;
    /** init layout according to the props */
    private initLayout;
    /** Move the thumb left or right according to the current state */
    private translateThumb;
    /** Calc the next position (x-axis) of the thumb */
    private computeThumbX;
    /** When a toggle action started. */
    private startToggle;
    /** When a toggle action is confirmed. */
    private confirmToggle;
    /** When a toggle action is finished (confirmed or canceled). */
    private endToggle;
}
export {};
//# sourceMappingURL=Switch.d.ts.map