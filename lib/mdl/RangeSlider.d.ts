/**
 * RangeSlider component.
 *
 * Created by awaidman on 16/1/21.
 */
import { Component } from 'react';
import { ViewProps } from 'react-native';
import { ThumbGestureCallback } from '../internal/Thumb';
import { NumRange } from '../types';
/** Props of {@link RangeSlider} */
export interface RangeSliderProps extends ViewProps {
    /**
     * Lower limit of the range, default is `0`
     * @defaultValue `0`
     */
    min: number;
    /**
     * Upper limit of the range, default is `100`
     * @defaultValue `100`
     */
    max: number;
    /** Initial value of range */
    range?: NumRange;
    /** The thickness of the RangeSlider track */
    trackSize?: number;
    /** Radius of the thumb of the RangeSlider */
    thumbRadius?: number;
    /** Padding for the hitSlop on the RangeSlider thumb */
    thumbPadding?: number;
    /** Color of the lower part of the track, it's also the color of the thumb */
    lowerTrackColor?: any;
    /** Color of the upper part of the track */
    upperTrackColor?: any;
    /** Callback when drag gesture begins */
    onStart?: ThumbGestureCallback;
    /** Callback when value changed */
    onChange?: (range: NumRange) => void;
    /** Callback when the value is confirmed */
    onConfirm?: (range: NumRange) => void;
    /** Step value of the RangeSlider, must be a divisor of max */
    step?: number;
}
/**
 * The `RangeSlider` component.
 *
 * @remarks
 * See {@link RangeSliderProps} for the available props.
 * Refer to {@link https://material.io/design/components/sliders.html | Guideline} or {@link http://www.getmdl.io/components/index.html#sliders-section | MDL implementation}
 */
export default class RangeSlider extends Component<RangeSliderProps> {
    /** Defaults, see {@link defaultProps} */
    static defaultProps: RangeSliderProps;
    /** Reference to App's {@link Theme} */
    private theme;
    private minThumbRef;
    private maxThumbRef;
    private trackRef;
    private overrideThumb;
    private _range;
    private _trackTotalLength;
    private _trackMarginH;
    private _trackMarginV;
    private _thumbRadiiWithBorder;
    private readonly _lowerTrackLength;
    private readonly _lowerTrackMin;
    constructor(props: RangeSliderProps);
    /** Public api to update the current `minValue` */
    /** Retrieve the current `minValue` */
    minValue: number;
    /** Public api to update the current `maxValue` */
    /** Retrieve the current `maxValue` */
    maxValue: number;
    private readonly minThumb;
    private readonly maxThumb;
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: RangeSliderProps): void;
    render(): JSX.Element;
    /** callback when the Track component's layout changes */
    private _onTrackLayout;
    private _beginMove;
    private _endMove;
    private _updateValueByTouch;
    private _snap;
    private _defaultStepIncrement;
    private _setRange;
    private _toSliderScale;
    private _toPixelScale;
    private _internalSetValue;
    private _emitChange;
    private _emitConfirm;
    private _updateValue;
    private _validateMove;
    private _moveThumb;
    private _onThumbRadiiUpdate;
    private _verifyStep;
}
//# sourceMappingURL=RangeSlider.d.ts.map