/**
 * RangeSlider component.
 *
 * Created by awaidman on 16/1/21.
 */
import React, { Component, createRef } from 'react';
import { Animated, LayoutChangeEvent, View, ViewProps } from 'react-native';

import Thumb, { NullableThumb, ThumbGestureCallback } from '../internal/Thumb';
import { getTheme } from '../theme';
import { NumRange } from '../types';

// The max scale of the thumb
const THUMB_SCALE_RATIO = 1.3;

// Width of the thumb border
const THUMB_BORDER_WIDTH = 2;

// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_V = 5;
const TRACK_EXTRA_MARGIN_H = 5;

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

const emptyRange = { min: 0, max: 0 };

/** Default props of {@link RangeSlider}, see {@link RangeSliderProps} */
const defaultProps: RangeSliderProps = {
  thumbPadding: 0,
  thumbRadius: 6,
  trackSize: 2,
  min: 0,
  max: 100,
  range: emptyRange,
  step: 1,
};

/**
 * The `RangeSlider` component.
 *
 * @remarks
 * See {@link RangeSliderProps} for the available props.
 * Refer to {@link https://material.io/design/components/sliders.html | Guideline} or {@link http://www.getmdl.io/components/index.html#sliders-section | MDL implementation}
 */
export default class RangeSlider extends Component<RangeSliderProps> {
  /** Defaults, see {@link defaultProps} */
  static defaultProps = defaultProps;

  /** Reference to App's {@link Theme} */
  private theme = getTheme();
  private minThumbRef = createRef<Thumb>();
  private maxThumbRef = createRef<Thumb>();
  private trackRef = createRef<View>();
  private overrideThumb: NullableThumb;
  private _range: NumRange = { min: 0, max: 0 };
  private _trackTotalLength = 0;
  private _trackMarginH = 0;
  private _trackMarginV = 0;
  private _thumbRadiiWithBorder = 0;
  private readonly _lowerTrackLength: Animated.Value;
  private readonly _lowerTrackMin: Animated.Value;

  constructor(props: RangeSliderProps) {
    super(props);
    // this.overrideThumbRef = undefined;
    this.overrideThumb = undefined;
    this._lowerTrackLength = new Animated.Value(this._range.max - this._range.min);
    this._lowerTrackMin = new Animated.Value(this._range.min);
  }

  /** Public api to update the current `minValue` */
  set minValue(value: number) {
    const range = this._setRange({
      min: value,
      max: this._toSliderScale(this._range.max),
    });
    this._updateValue(range);
    this._emitChange();
  }

  /** Retrieve the current `minValue` */
  get minValue(): number {
    return this._toSliderScale(this._range.min);
  }

  /** Public api to update the current `maxValue` */
  set maxValue(value: number) {
    const range = this._setRange({
      min: this._toSliderScale(this._range.min),
      max: value,
    });
    this._updateValue(range);
    this._emitChange();
  }

  /** Retrieve the current `maxValue` */
  get maxValue(): number {
    return this._toSliderScale(this._range.max);
  }

  private get minThumb(): NullableThumb {
    return this.minThumbRef && this.minThumbRef.current;
  }

  private get maxThumb(): NullableThumb {
    return this.maxThumbRef && this.maxThumbRef.current;
  }

  UNSAFE_componentWillMount() {
    this._onThumbRadiiUpdate(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: RangeSliderProps) {
    this._onThumbRadiiUpdate(nextProps);
    this._setRange(nextProps.range || emptyRange);
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
    // @ts-ignore
    const lowerTrackColor = this.props.lowerTrackColor || sliderStyle.lowerTrackColor;
    // @ts-ignore
    const upperTrackColor = this.props.upperTrackColor || sliderStyle.upperTrackColor;

    return (
      <View
        style={[
          this.props.style,
          {
            padding: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
          },
        ]}
      >
        <View
          ref={this.trackRef}
          style={{
            height: this.props.trackSize,
            backgroundColor: upperTrackColor,
            ...trackMargin,
          }}
          onLayout={this._onTrackLayout}
        >
          <Animated.View
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
          ref={this.minThumbRef}
          radius={this.props.thumbRadius}
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
          ref={this.maxThumbRef}
          radius={this.props.thumbRadius}
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

  // region private property initializers
  /** callback when the Track component's layout changes */
  private _onTrackLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }: LayoutChangeEvent) => {
    if (this._trackTotalLength !== width) {
      this._trackTotalLength = width;
      this._setRange(this.props.range || emptyRange);
      this._updateValue(this._range);
    }
  };

  // Respond to Grant gestures
  private _beginMove: ThumbGestureCallback = (ref, evt) => {
    this.props.onStart && this.props.onStart(ref, evt);
    this._updateValueByTouch(ref, evt);
  };

  // Respond to both cancelled and finished gestures
  private _endMove: ThumbGestureCallback = (ref, evt) => {
    const thumb = this.overrideThumb ? this.overrideThumb : ref;
    const dx = evt.nativeEvent.pageX;
    this.trackRef.current &&
      this.trackRef.current.measure((fx, fy, width, height, px) => {
        this._validateMove(dx, px, width);
        thumb.confirmMoveTo();
        this.overrideThumb = undefined;
      });
    this._emitConfirm();
  };

  // Respond to Move touch gestures
  private _updateValueByTouch: ThumbGestureCallback = (ref, evt) => {
    const thumb = this.overrideThumb ? this.overrideThumb : ref;
    const dx = evt.nativeEvent.pageX;
    this.trackRef.current &&
      this.trackRef.current.measure((fx, fy, width, height, px) => {
        const { currThumb, x } = this._validateMove(dx, px, width, thumb);
        this._internalSetValue(currThumb, x);
        this._moveThumb(currThumb, x);
      });
  };

  // Snap thumb by step, default step = 1
  private _snap = (val: number, inc = this._defaultStepIncrement()) => {
    const current = Math.round(val);
    const half = inc * 0.5;
    const diff = current % inc;

    if (diff >= half) {
      const multiplier = Math.round(current / inc);
      return inc * multiplier;
    }

    return current - diff;
  };

  private _defaultStepIncrement = () =>
    this._toPixelScale(this.props.max) / ((this.props.max - this.props.min) / (this.props.step || 1));
  // endregion

  // Throw error if preset ranges are invalid
  private _setRange({ min, max }: NumRange): NumRange {
    const min2Scale = this._toPixelScale(min || 0);
    const max2Scale = this._toPixelScale(max || 0);

    const minBounds = this._toPixelScale(this.props.min);
    const maxBounds = this._toPixelScale(this.props.max);

    if (min2Scale > max2Scale) {
      throw new Error(`Minimum slider value: ${min} is greater than max value: ${max}`);
    }
    if (min2Scale < minBounds || min2Scale > maxBounds) {
      throw new Error(`Minimum slider value: ${min} exceeds bounds:
        ${this.props.min} - ${this.props.max}`);
    }
    if (max2Scale < minBounds || max2Scale > maxBounds) {
      throw new Error(`Maximum slider value: ${max} exceeds bounds:
        ${this.props.min} - ${this.props.max}`);
    }

    // tslint:disable-next-line:no-console
    console.log(`range => (${min2Scale}, ${max2Scale})`);
    this._range = {
      min: min2Scale,
      max: max2Scale,
    };

    return this._range;
  }

  // Scale global xy coordinate values to track values
  private _toSliderScale(value: number): number {
    const trackToRange = (this.props.max - this.props.min) / this._trackTotalLength;
    return value * trackToRange + this.props.min;
  }

  // Scale track values to global xy coordinate system
  private _toPixelScale(value: number) {
    const rangeToTrack = this._trackTotalLength / (this.props.max - this.props.min);
    return (value - this.props.min) * rangeToTrack;
  }

  // Set values for thumb components for user touch events
  private _internalSetValue(ref?: Thumb, value?: number) {
    const target = ref === this.minThumb ? 'min' : 'max';
    this._range[target] = value || 0;
    this._emitChange();
  }

  // Send changed values to onChange callback
  private _emitChange() {
    this.props.onChange &&
      this.props.onChange({
        min: this._toSliderScale(this._range.min),
        max: this._toSliderScale(this._range.max),
      });
  }

  private _emitConfirm() {
    this.props.onConfirm &&
      this.props.onConfirm({
        min: this._toSliderScale(this._range.min),
        max: this._toSliderScale(this._range.max),
      });
  }

  // Internal update of ranges. Values should be to "Pixel Scale"
  private _updateValue(values: NumRange) {
    if (!this._trackTotalLength) {
      return;
    }

    const lthumb = this.minThumb;
    const rthumb = this.maxThumb;

    this._moveThumb(lthumb, values.min);
    // lthumb && lthumb.confirmMoveTo(values.min);
    lthumb && lthumb.confirmMoveTo();

    this._moveThumb(rthumb, values.max);
    // rthumb && rthumb.confirmMoveTo(values.max);
    rthumb && rthumb.confirmMoveTo();
  }

  // Ensure thumbs do not cross each other or track boundaries
  private _validateMove(
    dx: number,
    trackOriginX: number,
    trackWidth: number,
    thumb?: Thumb
  ): { currThumb?: Thumb; x?: number } {
    const x = dx - trackOriginX;

    const onTrack = (relX: number) => {
      const upperBound = relX >= trackWidth ? trackWidth : relX;
      return relX <= 0 ? 0 : upperBound;
    };

    if (!thumb) {
      return {};
    }

    const minThumb = this.minThumb;
    const maxThumb = this.maxThumb;
    if (!minThumb || !maxThumb) {
      return {};
    }

    let currThumb = thumb;
    if (minThumb.x === maxThumb.x) {
      if (x > maxThumb.x) {
        currThumb = this.overrideThumb = maxThumb;
        thumb && thumb.confirmMoveTo();
      } else if (x < minThumb.x) {
        currThumb = this.overrideThumb = minThumb;
        thumb && thumb.confirmMoveTo();
      }
    }

    let valX = 0;
    if (currThumb === minThumb) {
      valX = x >= maxThumb.x ? maxThumb.x : onTrack(x);
    } else if (currThumb === maxThumb) {
      valX = x <= minThumb.x ? minThumb.x : onTrack(x);
    }

    return { currThumb, x: this._snap(valX) };
  }

  // Induce smooth animation to move each thumb component
  private _moveThumb(thumb?: NullableThumb, x?: number) {
    if (!thumb || !x) {
      return;
    }

    thumb.moveTo(x);
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

  // when thumb radii updated, re-calc the dimensions
  private _onThumbRadiiUpdate(props: RangeSliderProps) {
    const thumbRadii = props.thumbRadius || 0;
    this._thumbRadiiWithBorder = thumbRadii + THUMB_BORDER_WIDTH;
    this._trackMarginV =
      this._thumbRadiiWithBorder * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_V - (this.props.trackSize || 0) / 2;
    this._trackMarginH = this._thumbRadiiWithBorder * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_H;
  }

  // Step must be a divisor of max
  private _verifyStep() {
    const divisor = (this.props.max - this.props.min) / (this.props.step || 1);
    if (divisor % 1 !== 0) {
      throw new Error(`Given step ( ${this.props.step} ) must be \
        a divisor of max ( ${this.props.max} )`);
    }
  }
}
