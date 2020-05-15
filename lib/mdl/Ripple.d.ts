/**
 * Reusable Ripple layout
 *
 * Created by ywu on 15/8/2.
 */
import { Component } from 'react';
import { MeasureOnSuccessCallback } from 'react-native';
import { MKTouchableProps } from '../internal/MKTouchable';
import { RippleLocation } from '../types';
/** Props of {@link Ripple } */
export declare type RippleProps = {
    /** Color of the `Ripple` layer */
    rippleColor?: string;
    /** Duration of the ripple effect, in milliseconds */
    rippleDuration?: number;
    /** Hot-spot position of the ripple effect, see {@link RippleLocation} */
    rippleLocation?: RippleLocation;
    /**
     * Whether a `Mask` layer should be used, to clip the ripple to the container’s bounds, default is `true`
     * @defaultValue `true`
     */
    maskEnabled?: boolean;
    /** Color of the `Mask` layer */
    maskColor?: string;
    /** Border width TODO move to `style`? */
    borderWidth?: number;
    /** Border radius of the `Mask` layer */
    maskBorderRadius?: number;
    /** Border radius of the `Mask` layer, in percentage (of min(width, height)) */
    maskBorderRadiusInPercent?: number;
    /** Duration of the mask effect (alpha), in milliseconds */
    maskDuration?: number;
    /** Animating the shadow (on pressed/released) or not */
    shadowAniEnabled?: boolean;
    /** Whether the component is disabled */
    disabled?: boolean;
} & MKTouchableProps;
/** State of the {@link Ripple} */
interface RippleState {
    width: number;
    height: number;
    maskBorderRadius: number;
    shadowOffsetY: number;
    ripple: {
        radii: number;
        dia: number;
        offset: {
            top: number;
            left: number;
        };
    };
}
/**
 * Reusable `Ripple` effect.
 */
export default class Ripple extends Component<RippleProps, RippleState> {
    /** Default props */
    static defaultProps: RippleProps;
    private containerRef;
    private maskRef;
    private rippleRef;
    private _animatedAlpha;
    private _animatedRippleScale;
    private _rippleAni?;
    private _pendingRippleAni?;
    constructor(props: RippleProps);
    /**
     * Measure the size of the `Ripple`.
     * @param cb {@link MeasureOnSuccessCallback | measurement callback}
     */
    measure(cb: MeasureOnSuccessCallback): any;
    /** Start the ripple effect */
    showRipple(): void;
    /** Stop the ripple effect */
    hideRipple(): void;
    /** {@inheritDoc @types/react#Component.render} */
    render(): JSX.Element;
    private _onLayout;
    private _onLayoutChange;
    private _calcMaskLayer;
    private _calcRippleLayer;
    private _onTouchEvent;
    private _onPointerDown;
    private _onPointerUp;
}
export {};
//# sourceMappingURL=Ripple.d.ts.map