//
// RangeSlider component.
//
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by awaidman on 16/1/21.
//

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from '../utils';

import {
  Animated,
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
class RangeSlider extends Component {
  constructor(props) {
    super(props);
    this.theme = getTheme();
    this._range = {
      min: 0,
      max: 0,
    };

    this._overriddenThumb = undefined;
    this._trackTotalLength = 0;
    this._lowerTrackLength = new Animated.Value(this._range.max - this._range.min);
    this._lowerTrackMin = new Animated.Value(this._range.min);
  }

  componentWillMount() {
    this._onThumbRadiiUpdate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._onThumbRadiiUpdate(nextProps);
    this._setRange({ min: nextProps.minValue, max: nextProps.maxValue });
    this._updateValue(this._range);
  }

  // region Property initializers
  _onTrackLayout = ({ nativeEvent: { layout: { width } } }) => {
    if (this._trackTotalLength !== width) {
      this._trackTotalLength = width;
      this._setRange({ min: this.props.minValue, max: this.props.maxValue });
      this._updateValue(this._range);
    }
  };

  // Respond to Grant gestures
  _beginMove = (ref, evt) => {
    if (this.props.onStart) {
      this.props.onStart(ref, evt);
    }

    this._updateValueByTouch(ref, evt);
  };

  // Respond to both cancelled and finished gestures
  _endMove = (ref, evt) => {
    const ovrRef = this._overriddenThumb ? this._overriddenThumb : ref;

    const dx = evt.nativeEvent.pageX;
    this.refs.track.measure((fx, fy, width, height, px) => {
      ovrRef.confirmMoveTo(this._validateMove(dx, px, width));
      this._overriddenThumb = null;
    });

    this._emitConfirm();
  };

  // Respond to Move touch gestures
  _updateValueByTouch = (ref, evt) => {
    const ovrRef = this._overriddenThumb ? this._overriddenThumb : ref;

    const dx = evt.nativeEvent.pageX;
    this.refs.track.measure((fx, fy, width, height, px) => {
      const { newRef, x } = this._validateMove(dx, px, width, ovrRef);
      this._internalSetValue(newRef, x);
      this._moveThumb(newRef, x);
    });
  };

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
  };

  _defaultStepIncrement = () =>
    this._toPixelScale(this.props.max) / ((this.props.max - this.props.min) / (this.props.step));

  // endregion

  // Throw error if preset ranges are invalid
  _setRange(range) {
    const min2Scale = this._toPixelScale(range.min);
    const max2Scale = this._toPixelScale(range.max);

    const minBounds = this._toPixelScale(this.props.min);
    const maxBounds = this._toPixelScale(this.props.max);

    if (min2Scale > max2Scale) {
      throw new Error(`Minimum slider value: ${range.min} is greater than max value: ${range.max}`);
    }
    if (min2Scale < minBounds || min2Scale > maxBounds) {
      throw new Error(`Minimum slider value: ${range.min} exceeds bounds:
        ${this.props.min} - ${this.props.max}`);
    }
    if (max2Scale < minBounds || max2Scale > maxBounds) {
      throw new Error(`Maximum slider value: ${range.max} exceeds bounds:
        ${this.props.min} - ${this.props.max}`);
    }

    this._range = {
      min: min2Scale || 0,
      max: max2Scale || 0,
    };

    return this._range;
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

  // Set values for thumb components for user touch events
  _internalSetValue(ref, value) {
    const target = ref === this.refs.minRange ? 'min' : 'max';
    this._range[target] = value;
    this._emitChange();
  }

  // Send changed values to onChange callback
  _emitChange() {
    if (this.props.onChange) {
      this.props.onChange({
        min: this._toSliderScale(this._range.min),
        max: this._toSliderScale(this._range.max),
      });
    }
  }

  _emitConfirm() {
    if (this.props.onConfirm) {
      this.props.onConfirm({
        min: this._toSliderScale(this._range.min),
        max: this._toSliderScale(this._range.max),
      });
    }
  }

  // Internal update of ranges. Values should be to "Pixel Scale"
  _updateValue(values) {
    if (!this._trackTotalLength) {
      return;
    }

    const lthumb = this.refs.minRange;
    const rthumb = this.refs.maxRange;

    this._moveThumb(lthumb, values.min);
    lthumb.confirmMoveTo(values.min);

    this._moveThumb(rthumb, values.max);
    rthumb.confirmMoveTo(values.max);
  }

  // Ensure thumbs do not cross each other or track boundaries
  _validateMove(dx, trackOriginX, trackWidth, ref) {
    const x = dx - trackOriginX;

    const onTrack = (relX) => {
      const upperBound = relX >= trackWidth ? trackWidth : relX;
      return relX <= 0 ? 0 : upperBound;
    };

    if (!ref) {
      return {};
    }

    const lthumb = this.refs.minRange;
    const rthumb = this.refs.maxRange;

    let oRef = ref;
    if (lthumb.x === rthumb.x) {
      if (x > rthumb.x) {
        oRef = this._overriddenThumb = rthumb;
        ref.confirmMoveTo(ref.x);
      } else if (x < lthumb.x) {
        oRef = this._overriddenThumb = lthumb;
        ref.confirmMoveTo(ref.x);
      }
    }

    let valX;
    if (oRef === lthumb) {
      valX = x >= rthumb.x ? rthumb.x : onTrack(x);
    } else if (oRef === rthumb) {
      valX = x <= lthumb.x ? lthumb.x : onTrack(x);
    }

    return { newRef: oRef, x: this._snap(valX) };
  }

  // Induce smooth animation to move each thumb component
  _moveThumb(ref, x) {
    ref.moveTo(x);

    Animated.parallel([
      Animated.timing(this._lowerTrackMin, {
        toValue: this._range.min,
        duration: 0,
      }),
      Animated.timing(this._lowerTrackLength, {
        toValue: this._range.max - this._range.min,
        duration: 0,
      }),
    ]).start();
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

  // Step must be a divisor of max
  _verifyStep() {
    const divisor = (this.props.max - this.props.min) / this.props.step;
    if (divisor % 1 !== 0) {
      throw new Error(`Given step ( ${this.props.step} ) must be \
        a divisor of max ( ${this.props.max} )`);
    }
  }

  _rollbackSlider(range) {
    this._setRange({ min: range.minValue, max: range.maxValue });
    this._updateValue(this._range);
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
              left: this._lowerTrackMin,
              width: this._lowerTrackLength,
              height: this.props.trackSize,
              backgroundColor: lowerTrackColor,
            }}
          />
        </View>
        <Thumb
          ref="minRange"
          radius={this.props.thumbRadius}
          trackMarginH={this._trackMarginH}
          enabledColor={lowerTrackColor}
          disabledColor={upperTrackColor}
          onGrant={this._beginMove}
          onMove={this._updateValueByTouch}
          onEnd={this._endMove}
          touchPadding={this.props.thumbPadding}
          style={{
            top: this._thumbRadiiWithBorder * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
        />

        <Thumb
          ref="maxRange"
          radius={this.props.thumbRadius}
          trackMarginH={this._trackMarginH}
          enabledColor={lowerTrackColor}
          disabledColor={upperTrackColor}
          onGrant={this._beginMove}
          onMove={this._updateValueByTouch}
          onEnd={this._endMove}
          touchPadding={this.props.thumbPadding}
          style={{
            top: this._thumbRadiiWithBorder * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
        />
      </View>
    );
  }
}

// Public api to update the current ranges
Object.defineProperty(RangeSlider.prototype, 'minValue', {
  set(minValue) {
    const range = this._setRange({
      min: minValue,
      max: this._toSliderScale(this._range.max),
    });
    this._updateValue(range);
    this._emitChange();
  },
  get() {
    return this._toSliderScale(this._range.min);
  },
  enumerable: true,
});

Object.defineProperty(RangeSlider.prototype, 'maxValue', {
  set(maxValue) {
    const range = this._setRange({
      min: this._toSliderScale(this._range.min),
      max: maxValue,
    });
    this._updateValue(range);
    this._emitChange();
  },
  get() {
    return this._toSliderScale(this._range.max);
  },
  enumerable: true,
});

// ## <section id='props'>Props</section>
RangeSlider.propTypes = {
  // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...(ViewPropTypes || View.propTypes),

  // Minimum value of the range, default is `0`
  min: PropTypes.number,

  // Maximum value of the range, default is `100`
  max: PropTypes.number,

  // Minimum predefined value for left hand thumb
  minValue: PropTypes.number,

  // Maximum predefined value for right hand thumb
  maxValue: PropTypes.number,

  // The thickness of the RangeSlider track
  trackSize: PropTypes.number,

  // Radius of the thumb of the RangeSlider
  thumbRadius: PropTypes.number,

  // Padding for the hitSlop on the RangeSlider thumb
  thumbPadding: PropTypes.number,

  // Color of the lower part of the track, it's also the color of the thumb
  lowerTrackColor: PropTypes.string,

  // Color of the upper part of the track
  upperTrackColor: PropTypes.string,

  // Callback when drag gesture begins
  onStart: PropTypes.func,

  // Callback when value changed
  onChange: PropTypes.func,

  // Callback when the value range is confirmed
  onConfirm: PropTypes.func,

  // Step value of the RangeSlider, must be a divisor of max
  step: PropTypes.number,
};

// ## <section id='defaults'>Defaults</section>
RangeSlider.defaultProps = {
  thumbPadding: 0,
  thumbRadius: 6,
  trackSize: 2,
  min: 0,
  max: 100,
  step: 1,
};


// ## Public interface
module.exports = RangeSlider;
