//
// MDL style Slider component.
//
// - @see [MDL Slider](http://www.getmdl.io/components/index.html#sliders-section)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/8/23.
//

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  Animated,
  PanResponder,
  View,
} from 'react-native';

import { getTheme } from '../theme';
import Thumb from '../internal/Thumb';

// The max scale of the thumb
const THUMB_SCALE_RATIO = 1.3;

// Width of the thumb border
const THUMB_BORDER_WIDTH = 2;

// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_V = 5;
const TRACK_EXTRA_MARGIN_H = 5;


// ## <section id='Slider'>Slider</section>
class Slider extends Component {
  // region Static property initializers
  // ## <section id='props'>Props</section>
  static propTypes = {
    // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
    ...View.propTypes,

    // Minimum value of the range, default is `0`
    min: PropTypes.number,

    // Maximum value of the range, default is `100`
    max: PropTypes.number,

    // Current value
    value: PropTypes.number,

    // The thickness of the Slider track
    trackSize: PropTypes.number,

    // Radius of the thumb of the Slider
    thumbRadius: PropTypes.number,

    // Color of the lower part of the track, it's also the color of the thumb
    lowerTrackColor: PropTypes.string,

    // Color of the upper part of the track
    upperTrackColor: PropTypes.string,

    // Callback when value changed
    onChange: PropTypes.func,

    // Callback when the value is confirmed
    onConfirm: PropTypes.func,

    // Step value of the RangeSlider, must be a divisor of max
    step: PropTypes.number,
  };

  // ## <section id='defaults'>Defaults</section>
  static defaultProps = {
    thumbRadius: 6,
    trackSize: 2,
    min: 0,
    max: 100,
    step: 1,
  };
  // endregion

  constructor(props) {
    super(props);
    this.theme = getTheme();
    this._value = 0;
    this._trackTotalLength = 0;
    this._prevPointerX = 0;
    this._animatedTrackLength = new Animated.Value(0);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt) => {
        this._prevPointerX = evt.nativeEvent.locationX;
        this._onTouchEvent({
          type: 'TOUCH_DOWN',
          x: this._prevPointerX,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        this._onTouchEvent({
          type: 'TOUCH_MOVE',
          x: this._prevPointerX + gestureState.dx,
        });
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (evt, gestureState) => {
        this._onPanResponderEnd(gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this._onPanResponderEnd(gestureState, true);
      },
      onShouldBlockNativeResponder: () => true,
    });
  }

  componentWillMount() {
    this._onThumbRadiiUpdate(this.props);
    this._internalSetValue(this.props.value, false);
  }

  componentWillReceiveProps(nextProps) {
    this._onThumbRadiiUpdate(nextProps);
    this._internalSetValue(nextProps.value, false);
    this._aniUpdateValue(nextProps.value);
  }

  // region Property initializers
  _onTrackLayout = ({ nativeEvent: { layout: { width } } }) => {
    if (this._trackTotalLength !== width) {
      this._trackTotalLength = width;
      this._aniUpdateValue(this.value);
    }
  };
  // endregion

  _internalSetValue(value, fireChange = true) {
    if (this._value === value) return;
    this._value = value;
    if (fireChange) {
      this._emitChange(value);
    }
  }

  _emitChange(newValue) {
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  _emitConfirm() {
    if (this.props.onConfirm) {
      this.props.onConfirm(this._value);
    }
  }

  _aniUpdateValue(value) {
    if (!this._trackTotalLength) {
      return;
    }

    const ratio = (value - this.props.min) / (this.props.max - this.props.min);
    const x = ratio * this._trackTotalLength;
    this._moveThumb(x);
    this._confirmMoveThumb(x);
  }

  _onPanResponderEnd(gestureState, cancelled) {
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
      case 'TOUCH_MOVE':
        this._updateValueByTouch(evt);
        break;
      case 'TOUCH_UP':
        this._confirmUpdateValueByTouch(evt);
        break;
      case 'TOUCH_CANCEL':
        // should not use the coordination inside a cancelled event
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
    this._internalSetValue(_value);  // report changes in 'real-time'
    this._moveThumb(x);
  }

  // Scale global xy coordinate values to track values
  _toSliderScale(value) {
    const trackToRange = (this.props.max - this.props.min) / this._trackTotalLength;
    return (value * trackToRange) + this.props.min;
  }

  // Scale track values to global xy coordinate system
  _toPixelScale(value) {
    const rangeToTrack = this._trackTotalLength / (this.props.max - this.props.min);
    return (value - this.props.min) * rangeToTrack;
  }

  // Snap thumb by step, default step = 1
  _snap = (val, inc = this._defaultStepIncrement()) => {
    const current = Math.round(val);
    const half = inc * 0.5;
    const diff = current % inc;

    if (diff >= half) {
      const multiplier = Math.round(current / inc);
      return (inc * multiplier);
    }

    return (current - diff);
  }

  _defaultStepIncrement = () =>
    this._toPixelScale(this.props.max) / ((this.props.max - this.props.min) / (this.props.step));

  _confirmUpdateValueByTouch(evt) {
    if (evt) {
      const { x } = this._getTouchOnTrack(evt);
      this._confirmMoveThumb(x);
    } else {
      this._confirmMoveThumb();
    }
    this._emitConfirm();
  }

  _moveThumb(x) {
    this.refs.thumb.moveTo(x);

    Animated.timing(this._animatedTrackLength, {
      toValue: x,
      duration: 0,
    }).start();
  }

  _confirmMoveThumb(x) {
    this.refs.thumb.confirmMoveTo(x);
  }

  // when thumb radii updated, re-calc the dimens
  _onThumbRadiiUpdate(props) {
    this._thumbRadii = props.thumbRadius;
    this._thumbRadiiWithBorder = this._thumbRadii + THUMB_BORDER_WIDTH;
    this._trackMarginV = this._thumbRadiiWithBorder * THUMB_SCALE_RATIO +
      TRACK_EXTRA_MARGIN_V - this.props.trackSize / 2;
    this._trackMarginH = this._thumbRadiiWithBorder * THUMB_SCALE_RATIO +
      TRACK_EXTRA_MARGIN_H;
  }

  _verifyStep() {
    const divisor = this.props.max / this.props.step;
    if (divisor % 1 !== 0) {
      throw new Error(
        `Given step ( ${this.props.step} ) must be a divisor of max ( ${this.props.max} )`
      );
    }
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
    const lowerTrackColor = this.props.lowerTrackColor || sliderStyle.lowerTrackColor;
    const upperTrackColor = this.props.upperTrackColor || sliderStyle.upperTrackColor;

    return (
      <View ref="container"
        style={[this.props.style, {
          padding: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }]}
        pointerEvents="box-only"
        {...this._panResponder.panHandlers}
      >
        <View ref="track"
          style={{
            height: this.props.trackSize,
            backgroundColor: upperTrackColor,
            ...trackMargin,
          }}
          onLayout={this._onTrackLayout}
        >
          <Animated.View
            ref="lowerTrack"
            style={{
              position: 'absolute',
              width: this._animatedTrackLength,
              height: this.props.trackSize,
              backgroundColor: lowerTrackColor,
            }}
          />
        </View>
        <Thumb
          ref="thumb"
          radius={this.props.thumbRadius}
          trackSize={this.props.trackSize}
          trackMarginH={this._trackMarginH}
          enabledColor={lowerTrackColor}
          disabledColor={upperTrackColor}
          style={{
            top: this._thumbRadiiWithBorder * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
        />
      </View>
    );
  }
}

// Public api to update the current value
Object.defineProperty(Slider.prototype, 'value', {
  set(value) {
    this._internalSetValue(value);
    this._aniUpdateValue(value);
  },
  get() {
    return this._value;
  },
  enumerable: true,
});


// ## Public interface
module.exports = Slider;
