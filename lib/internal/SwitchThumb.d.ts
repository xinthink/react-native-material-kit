import { Component } from 'react';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';
export interface ThumbProps extends ViewProps {
    checked: boolean;
    onColor?: string;
    offColor?: string;
    rippleColor?: string;
    rippleAniDuration: number;
    rippleRadius: number;
    thumbStyle?: StyleProp<ViewStyle>;
}
interface ThumbState {
    checked: boolean;
}
/***
 * The `Thumb` part of a {@link Switch}.
 * Which is displayed as a circle with shadow and ripple effect.
 */
export declare class Thumb extends Component<ThumbProps, ThumbState> {
    /** Default props of `Thumb` */
    static defaultProps: ThumbProps;
    private animatedRippleScale;
    private animatedRippleAlpha;
    private rippleAni?;
    private pendingRippleAni?;
    constructor(props: ThumbProps);
    /**
     * TODO using controlled components.
     * @see https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html?#preferred-solutions
     */
    UNSAFE_componentWillReceiveProps(nextProps: ThumbProps): void;
    /** When a toggle action started. */
    startToggle(): void;
    /** When a toggle action is finished (confirmed or canceled). */
    endToggle(): void;
    /**
     * When a toggle action (from the given state) is confirmed.
     * @param `fromState` the previous state
     */
    confirmToggle(fromState: boolean): void;
    /** Start the ripple effect */
    showRipple(): void;
    /** Stop the ripple effect */
    hideRipple(): void;
    render(): JSX.Element;
}
declare const AnimatedThumb: any;
export default AnimatedThumb;
//# sourceMappingURL=SwitchThumb.d.ts.map