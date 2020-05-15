/**
 * The `Thumb` part of {@link Slider} and {@link RangeSlider} components.
 *
 * Created by awaidman on 16/1/21.
 */
import { Component } from 'react';
import { GestureResponderEvent, ViewProps } from 'react-native';
/** Gesture event callback for the `Thumb` component. see {@link GestureResponderEvent} */
export declare type ThumbGestureCallback = (thumb: Thumb, event: GestureResponderEvent) => void;
export declare type NullableThumb = Thumb | null | undefined;
/** Props of {@link Thumb}, which extends {@link @types/react-native#ViewProps | ViewProps}  */
export interface ThumbProps extends ViewProps {
    /** Callback to handle onPanResponderGrant gesture */
    onGrant?: ThumbGestureCallback;
    /** Callback to handle onPanResponderMove gesture */
    onMove?: ThumbGestureCallback;
    /** Callback to handle onPanResponderRelease/Terminate gesture */
    onEnd?: ThumbGestureCallback;
    /** Color when thumb has no value */
    disabledColor?: string;
    /** Color when thumb has value */
    enabledColor?: string;
    /** Radius of thumb component */
    radius?: number;
    /** Padding for the hitSlop on the Thumb component */
    touchPadding?: number;
}
/** State of {@link Thumb} component */
interface ThumbState {
    color: any;
    borderColor: any;
}
/** `Thumb` component of {@link Slider} and {@link RangeSlider}. */
export default class Thumb extends Component<ThumbProps, ThumbState> {
    /** Defaults, see {@link defaultProps} */
    static defaultProps: ThumbProps;
    /** current x-axis position */
    x: number;
    private _radii;
    private _dia;
    private _containerRadii;
    private _containerDia;
    private readonly _trackMarginH;
    private _panResponder;
    private _animatedLeft;
    private _animatedScale;
    constructor(props: ThumbProps);
    UNSAFE_componentWillMount(): void;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: ThumbProps): void;
    componentWillUnmount(): void;
    /**
     * animate the sliding
     * @param x target position, relative to the track
     */
    moveTo(x: number): void;
    /** stop sliding */
    confirmMoveTo(): void;
    /** {@inheritDoc @types/react#Component.render} */
    render(): JSX.Element;
    private _onRadiiUpdate;
    private _getOnSliding;
    private _onExplode;
    private _onCollapse;
}
export {};
//# sourceMappingURL=Thumb.d.ts.map