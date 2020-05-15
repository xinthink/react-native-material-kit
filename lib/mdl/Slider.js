/**
 * MDL style Slider component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#sliders-section | MDL Slider}
 *
 * Created by ywu on 15/8/23.
 */
import React, { Component, createRef } from 'react';
import { Animated, PanResponder, View, } from 'react-native';
import Thumb from '../internal/Thumb';
import { getTheme } from '../theme';
// The max scale of the thumb
const THUMB_SCALE_RATIO = 1.3;
// Width of the thumb border
const THUMB_BORDER_WIDTH = 2;
// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_V = 5;
const TRACK_EXTRA_MARGIN_H = 5;
/** Default props of {@link Slider}, see {@link SliderProps} */
const defaultProps = {
    thumbPadding: 0,
    thumbRadius: 6,
    trackSize: 2,
    min: 0,
    max: 100,
    value: 0,
    step: 1,
};
/**
 * The `Slider` component.
 *
 * @remarks
 * See {@link SliderProps} for the available props.
 * Refer to {@link https://material.io/design/components/sliders.html | Guideline} or {@link http://www.getmdl.io/components/index.html#sliders-section | MDL implementation}
 */
export default class Slider extends Component {
    constructor(props) {
        super(props);
        /** Reference to App's {@link Theme} */
        this.theme = getTheme();
        this.thumbRef = createRef();
        this._value = 0;
        this._trackMarginH = 0;
        this._trackMarginV = 0;
        this._trackTotalLength = 0;
        this._thumbRadiiWithBorder = 0;
        this._prevPointerX = 0;
        this._animatedTrackLength = new Animated.Value(0);
        this._panResponder = {};
        // region Property initializers
        this._onTrackLayout = ({ nativeEvent: { layout: { width }, }, }) => {
            if (this._trackTotalLength !== width) {
                this._trackTotalLength = width;
                this._aniUpdateValue(this.value);
            }
        };
        // Snap thumb by step, default step = 1
        this._snap = (val, inc = this._defaultStepIncrement()) => {
            const current = Math.round(val);
            const half = inc * 0.5;
            const diff = current % inc;
            if (diff >= half) {
                const multiplier = Math.round(current / inc);
                return inc * multiplier;
            }
            return current - diff;
        };
        this._defaultStepIncrement = () => this._toPixelScale(this.props.max) / (this.props.max - this.props.min) / (this.props.step || 1);
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: e => {
                this._prevPointerX = e.nativeEvent.locationX;
                this._onTouchEvent({
                    type: 'TOUCH_DOWN',
                    x: this._prevPointerX,
                });
            },
            onPanResponderMove: (e, state) => {
                this._onTouchEvent({
                    type: 'TOUCH_MOVE',
                    x: this._prevPointerX + state.dx,
                });
            },
            onPanResponderTerminationRequest: () => false,
            onPanResponderRelease: (e, state) => {
                this._onPanResponderEnd(state);
            },
            onPanResponderTerminate: (e, state) => {
                this._onPanResponderEnd(state, true);
            },
            onShouldBlockNativeResponder: () => true,
        });
    }
    // Public api to update the current value
    set value(value) {
        this._internalSetValue(value);
        this._aniUpdateValue(value);
    }
    // Retrieve the current value
    get value() {
        return this._value;
    }
    UNSAFE_componentWillMount() {
        this._onThumbRadiiUpdate(this.props);
        this._internalSetValue(this.props.value, false);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this._onThumbRadiiUpdate(nextProps);
        this._internalSetValue(nextProps.value, false);
        this._aniUpdateValue(nextProps.value);
    }
    render() {
        this._verifyStep();
        // making room for the Thumb, cause's Android doesn't support `overflow: visible`
        // - @see http://bit.ly/1Fzr5SE
        const trackMargin = {
            marginLeft: this._trackMarginH,
            marginRight: this._trackMarginH,
            marginTop: this._trackMarginV,
            marginBottom: this._trackMarginV,
        };
        const sliderStyle = this.theme.sliderStyle;
        // @ts-ignore
        const lowerTrackColor = this.props.lowerTrackColor || sliderStyle.lowerTrackColor;
        // @ts-ignore
        const upperTrackColor = this.props.upperTrackColor || sliderStyle.upperTrackColor;
        return (<View style={[
            this.props.style,
            {
                padding: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
            },
        ]} pointerEvents="box-only" {...this._panResponder.panHandlers}>
        <View style={Object.assign({ height: this.props.trackSize, backgroundColor: upperTrackColor }, trackMargin)} onLayout={this._onTrackLayout}>
          <Animated.View style={{
            position: 'absolute',
            width: this._animatedTrackLength,
            height: this.props.trackSize,
            backgroundColor: lowerTrackColor,
        }}/>
        </View>
        <Thumb ref={this.thumbRef} radius={this.props.thumbRadius} 
        // trackSize={this.props.trackSize}
        // trackMarginH={this._trackMarginH}
        enabledColor={lowerTrackColor} disabledColor={upperTrackColor} touchPadding={this.props.thumbPadding} style={{
            top: this._thumbRadiiWithBorder * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
        }}/>
      </View>);
    }
    // endregion
    _internalSetValue(value, fireChange = true) {
        if (this._value !== value) {
            this._value = value;
            fireChange && this._emitChange(value);
        }
    }
    _emitChange(newValue) {
        this.props.onChange && this.props.onChange(newValue);
    }
    _emitOnPressIn() {
        this.props.onPressIn && this.props.onPressIn();
    }
    _emitOnPressOut() {
        this.props.onPressOut && this.props.onPressOut();
    }
    _emitConfirm() {
        this.props.onConfirm && this.props.onConfirm(this._value);
    }
    _aniUpdateValue(value) {
        if (this._trackTotalLength) {
            const ratio = (value - this.props.min) / (this.props.max - this.props.min);
            const x = ratio * this._trackTotalLength;
            this._moveThumb(x);
            this._confirmMoveThumb();
        }
    }
    _onPanResponderEnd(gestureState, cancelled = false) {
        if (!cancelled) {
            this._prevPointerX = this._prevPointerX + gestureState.dx;
        }
        this._onTouchEvent({
            type: cancelled ? 'TOUCH_CANCEL' : 'TOUCH_UP',
            x: this._prevPointerX,
        });
    }
    // Touch events handling
    _onTouchEvent(evt) {
        switch (evt.type) {
            case 'TOUCH_DOWN':
                this._emitOnPressIn();
                this._updateValueByTouch(evt);
                break;
            case 'TOUCH_MOVE':
                this._updateValueByTouch(evt);
                break;
            case 'TOUCH_UP':
                this._emitOnPressOut();
                this._confirmUpdateValueByTouch();
                break;
            case 'TOUCH_CANCEL':
                // should not use the coordination inside a cancelled event
                this._emitOnPressOut();
                this._confirmUpdateValueByTouch();
                break;
            default:
                break;
        }
    }
    // get touch position relative to the track
    _getTouchOnTrack(evt) {
        // touch location relative to the track
        let x = Math.max(evt.x - this._trackMarginH, 0);
        x = this._snap(Math.min(x, this._trackTotalLength));
        const ratio = x / this._trackTotalLength;
        return { x, ratio };
    }
    _updateValueByTouch(evt) {
        const { x, ratio } = this._getTouchOnTrack(evt);
        const _value = ratio * (this.props.max - this.props.min) + this.props.min;
        this._internalSetValue(_value); // report changes in 'real-time'
        this._moveThumb(x);
    }
    // Scale global xy coordinate values to track values
    _toSliderScale(value) {
        const trackToRange = (this.props.max - this.props.min) / this._trackTotalLength;
        return value * trackToRange + this.props.min;
    }
    // Scale track values to global xy coordinate system
    _toPixelScale(value) {
        const rangeToTrack = this._trackTotalLength / (this.props.max - this.props.min);
        return (value - this.props.min) * rangeToTrack;
    }
    _confirmUpdateValueByTouch() {
        this._confirmMoveThumb();
        this._emitConfirm();
    }
    _moveThumb(x) {
        this.thumbRef.current && this.thumbRef.current.moveTo(x);
        Animated.timing(this._animatedTrackLength, {
            toValue: x,
            duration: 0,
        }).start();
    }
    _confirmMoveThumb() {
        this.thumbRef.current && this.thumbRef.current.confirmMoveTo();
    }
    // when thumb radii updated, re-calc the dimensions
    _onThumbRadiiUpdate(props) {
        this._thumbRadiiWithBorder = (props.thumbRadius || 6) + THUMB_BORDER_WIDTH;
        this._trackMarginV =
            this._thumbRadiiWithBorder * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_V - (props.trackSize || 2) / 2;
        this._trackMarginH = this._thumbRadiiWithBorder * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_H;
    }
    _verifyStep() {
        const divisor = this.props.max / (this.props.step || 1);
        if (divisor % 1 !== 0) {
            throw new Error(`Given step ( ${this.props.step} ) must be a divisor of max ( ${this.props.max} )`);
        }
    }
}
/** Defaults, see {@link defaultProps} */
Slider.defaultProps = defaultProps;
//# sourceMappingURL=Slider.js.map