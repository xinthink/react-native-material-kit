/**
 * MDL style Slider component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#sliders-section | MDL Slider}
 *
 * Created by ywu on 15/8/23.
 */
import { Component } from 'react';
import { ViewProps } from 'react-native';
/** Props of {@link Slider} */
export interface SliderProps extends ViewProps {
    /**
     * Minimum value of the range, default is `0`.
     * @defaultValue `0`
     */
    min: number;
    /**
     * Maximum value of the range, default is `100`.
     * @defaultValue `100`
     */
    max: number;
    /**
     * Current value
     * @defaultValue `0`
     */
    value: number;
    /** The thickness of the Slider track */
    trackSize?: number;
    /** Radius of the thumb of the Slider */
    thumbRadius?: number;
    /** Padding for the hitSlop on the Slider thumb */
    thumbPadding?: number;
    /** Color of the lower part of the track, it's also the color of the thumb */
    lowerTrackColor?: any;
    /** Color of the upper part of the track */
    upperTrackColor?: any;
    /** Callback when value changed */
    onChange?: (value: number) => void;
    /** Callback when slider is pressed anywhere */
    onPressIn?: () => void;
    /** Callback when slider stops being pressed */
    onPressOut?: () => void;
    /** Callback when the value is confirmed */
    onConfirm?: (value: number) => void;
    /** Step value of the Slider, must be a divisor of max */
    step?: number;
}
/**
 * The `Slider` component.
 *
 * @remarks
 * See {@link SliderProps} for the available props.
 * Refer to {@link https://material.io/design/components/sliders.html | Guideline} or {@link http://www.getmdl.io/components/index.html#sliders-section | MDL implementation}
 */
export default class Slider extends Component<SliderProps> {
    /** Defaults, see {@link defaultProps} */
    static defaultProps: SliderProps;
    /** Reference to App's {@link Theme} */
    private theme;
    private thumbRef;
    private _value;
    private _trackMarginH;
    private _trackMarginV;
    private _trackTotalLength;
    private _thumbRadiiWithBorder;
    private _prevPointerX;
    private _animatedTrackLength;
    private _panResponder;
    constructor(props: SliderProps);
    value: number;
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: SliderProps): void;
    render(): JSX.Element;
    private _onTrackLayout;
    private _snap;
    private _defaultStepIncrement;
    private _internalSetValue;
    private _emitChange;
    private _emitOnPressIn;
    private _emitOnPressOut;
    private _emitConfirm;
    private _aniUpdateValue;
    private _onPanResponderEnd;
    private _onTouchEvent;
    private _getTouchOnTrack;
    private _updateValueByTouch;
    private _toSliderScale;
    private _toPixelScale;
    private _confirmUpdateValueByTouch;
    private _moveThumb;
    private _confirmMoveThumb;
    private _onThumbRadiiUpdate;
    private _verifyStep;
}
//# sourceMappingURL=Slider.d.ts.map