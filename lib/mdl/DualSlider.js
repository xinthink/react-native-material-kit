//
// MDL style DualSlider component.
//
// - @see [MDL Slider](http://www.getmdl.io/components/index.html#sliders-section)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/8/23.
//

const React = require('react-native');
const MKColor = require('../MKColor');
const {getTheme} = require('../theme');
const Thumb = require('./Thumb')

const {
  Component,
  Animated,
  View,
  PanResponder,
  PropTypes,
} = React;


// Default color of the upper part of the track
const DEFAULT_UPPER_TRACK_COLOR = '#cccccc';

// Color of the thumb when lowest value is chosen
const LOWEST_VALUE_THUMB_COLOR = 'white';

// The max scale of the thumb
const THUMB_SCALE_RATIO = 1.3;

// Width of the thumb border
const THUMB_BORDER_WIDTH = 2

// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_V = 5;
const TRACK_EXTRA_MARGIN_H = 5;


// ## <section id='Slider'>Slider</section>
class DualSlider extends Component {
  constructor(props) {
    super(props);
    this._range = {
      minRange: 0,
      maxRange: 0,
    };

    // Added to fix a bug where the sliders get stuck on top of each other
    this._overriddenThumb
    this._trackTotalLength = 0;
    this._lowerTrackLength = new Animated.Value(this._range.maxRange - this._range.minRange);
    this._lowerTrackMin = new Animated.Value(this._range.minRange)
  }

  get sliderMin () { return this._toSliderScale(this._range.minRange) }
  get sliderMax () { return this._toSliderScale(this._range.maxRange) }
  set sliderMin (sliderMin) { this._setRange() }
  set sliderMax (sliderMax) { this._setRange() }

  componentWillMount() {
    this._onThumbRadiiUpdate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._onThumbRadiiUpdate(nextProps);
  }

  _onTrackLayout({nativeEvent: {layout: {width}}}) {
    if (this._trackTotalLength !== width) {
      this._trackTotalLength = width;
      this._setRange()
      this._updateValue(this._range);
    }
  }

  _setRange() {
    var min2Scale = this._toPixelScale(this.props.sliderMin)
    var max2Scale = this._toPixelScale(this.props.sliderMax)

    var minBounds = this._toPixelScale(this.props.min)
    var maxBounds = this._toPixelScale(this.props.max)

    if(min2Scale > max2Scale) { throw 'Minimum slider value: ' + this.props.sliderMin + ' is greater than max value: ' + this.props.sliderMax }
    if(min2Scale < minBounds || min2Scale > maxBounds) { throw 'Minimum slider value: ' + this.props.sliderMin + ' exceeds bounds: ' + this.props.min + "-" + this.props.max }
    if(max2Scale < minBounds || max2Scale > maxBounds) { throw 'Maximum slider value: ' + this.props.sliderMax + ' exceeds bounds: ' + this.props.min + "-" + this.props.max }

    this._range = {
      minRange: min2Scale ? min2Scale : 0,
      maxRange: max2Scale ? max2Scale : 0,
    }
  }

  _toSliderScale(value) {
    var trackToRange = (this.props.max - this.props.min) / this._trackTotalLength
    return (value * trackToRange) + this.props.min
  }

  _toPixelScale(value) {
    var rangeToTrack = this._trackTotalLength / (this.props.max - this.props.min)
    return value * rangeToTrack - this.props.min
  }

  _internalSetValue(ref, value) {
    var target = ref === this.refs.minRange ? 'minRange' : 'maxRange'
    this._range[target] = value
    this._emitChange();
  }

  _emitChange() {
    if (this.props.onChange) {
      this.props.onChange({
        min: this._toSliderScale(this._range.minRange),
        max: this._toSliderScale(this._range.maxRange),
      });
    }
  }

  _updateValue(values) {
    if (!this._trackTotalLength) {
      return;
    }

    var lthumb = this.refs.minRange;
    var rthumb = this.refs.maxRange;

    this._moveThumb(lthumb, values.minRange);
    lthumb.confirmMoveTo(values.minRange);

    this._moveThumb(rthumb, values.maxRange);
    rthumb.confirmMoveTo(values.minRange);
  }

  _validateMove(dx, trackOriginX, trackWidth, ref) {
    var x = dx - trackOriginX

    var onTrack = (x) => {
      return x <= 0 ? 0 : (x >= trackWidth ? trackWidth : x)
    }

    if(ref) {
      var lthumb = this.refs.minRange;
      var rthumb = this.refs.maxRange;

      var oRef = ref
      if(lthumb.x == rthumb.x) {
        if(x > rthumb.x) {
          oRef = this._overriddenThumb = rthumb
          ref.confirmMoveTo(ref.x)
        }
        else if(x < lthumb.x) {
          oRef = this._overriddenThumb = lthumb
          ref.confirmMoveTo(ref.x)
        }
      }

      var valX
      if(oRef === lthumb)      { valX = x >= rthumb.x ? rthumb.x : onTrack(x) }
      else if(oRef === rthumb) { valX = x <= lthumb.x ? lthumb.x : onTrack(x) }

      return {newRef: oRef, x: valX}
    }
  }

  _updateValueByTouch(ref, evt) {
    var ref = this._overriddenThumb ? this._overriddenThumb : ref

    var dx = evt.nativeEvent.pageX
    this.refs.track.measure((fx, fy, width, height, px, py) => {
      var {newRef, x} = this._validateMove(dx, px, width, ref)
      this._internalSetValue(newRef, x)
      this._moveThumb(newRef, x);
    })
  }

  _moveThumb(ref, x) {
    ref.moveTo(x);

    Animated.parallel([
      Animated.timing(this._lowerTrackMin, {
        toValue: this._range.minRange,
        duration: 0,
      }),
      Animated.timing(this._lowerTrackLength, {
        toValue: this._range.maxRange - this._range.minRange,
        duration: 0,
      }),
    ]).start()
  }

  _endMove(ref, evt) {
    var ref = this._overriddenThumb ? this._overriddenThumb : ref

    var dx = evt.nativeEvent.pageX
    this.refs.track.measure((fx, fy, width, height, px, py) => {
      ref.confirmMoveTo(this._validateMove(dx, px, width))
      this._overriddenThumb = null
    })
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

  render() {
    // making room for the Thumb, cause's Android doesn't support `overflow: visible`
    // - @see http://bit.ly/1Fzr5SE
    const trackMargin = {
      marginLeft: this._trackMarginH,
      marginRight: this._trackMarginH,
      marginTop: this._trackMarginV,
      marginBottom: this._trackMarginV,
    };

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
                backgroundColor: this.props.upperTrackColor,
                ...trackMargin,
              }}
              onLayout={this._onTrackLayout.bind(this)}

          >
          <Animated.View
            ref="lowerTrack"
            style={{
              position: 'absolute',
              left: this._lowerTrackMin,
              width: this._lowerTrackLength,
              height: this.props.trackSize,
              backgroundColor: this.props.lowerTrackColor || getTheme().primaryColor,
            }}
            />
        </View>
        <Thumb
          ref="minRange"
          radius={this.props.thumbRadius}
          trackSize={this.props.trackSize}
          trackMarginH={this._trackMarginH}
          enabledColor={this.props.lowerTrackColor || getTheme().primaryColor}
          disabledColor={this.props.upperTrackColor}

          onGrant   = {(ref, evt) => this._updateValueByTouch(ref, evt)}
          onMove    = {(ref, evt) => this._updateValueByTouch(ref, evt)}
          onEnd     = {(ref, evt) => this._endMove(ref, evt)}

          style={{
            top: this._thumbRadiiWithBorder * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
          />

        <Thumb
          ref="maxRange"
          radius={this.props.thumbRadius}
          trackSize={this.props.trackSize}
          trackMarginH={this._trackMarginH}
          enabledColor={this.props.lowerTrackColor || getTheme().primaryColor}
          disabledColor={this.props.upperTrackColor}

          onGrant   = {(ref, evt, gestureState) => this._updateValueByTouch(ref, evt, gestureState)}
          onMove    = {(ref, evt, gestureState) => this._updateValueByTouch(ref, evt, gestureState)}
          onEnd     = {(ref, evt, gestureState) => this._endMove(ref, evt, gestureState)}

          style={{
            top: this._thumbRadiiWithBorder * (THUMB_SCALE_RATIO - 1) + TRACK_EXTRA_MARGIN_V,
          }}
          />
      </View>
    );
  }
}

// ## <section id='props'>Props</section>
DualSlider.propTypes = {
  // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Minimum value of the range, default is `0`
  min: PropTypes.number,

  // Maximum value of the range, default is `100`
  max: PropTypes.number,

  // Min preset/user-set slider value
  sliderMin: PropTypes.number,

  // Max preset/user-set slider value
  sliderMax: PropTypes.number,

  // The thickness of the DualSlider track
  trackSize: PropTypes.number,

  // Radius of the thumb of the DualSlider
  thumbRadius: PropTypes.number,

  // Color of the lower part of the track, it's also the color of the thumb
  lowerTrackColor: PropTypes.string,

  // Color of the upper part of the track
  upperTrackColor: PropTypes.string,

  // Callback when value changed
  onChange: PropTypes.func,
};

// ## <section id='defaults'>Defaults</section>
DualSlider.defaultProps = {
  thumbRadius: 6,
  trackSize: 2,
  min: 0,
  max: 100,
  upperTrackColor: DEFAULT_UPPER_TRACK_COLOR,
};


// --------------------------
// Builder
//
const {
  Builder,
} = require('../builder');

//
// ## DualSlider builder
//
class SliderBuilder extends Builder {
  build() {
    const BuiltSlider = class extends DualSlider {};
    BuiltSlider.defaultProps = Object.assign({}, DualSlider.defaultProps, this.toProps());
    return BuiltSlider;
  }
}

// define builder method for each prop
SliderBuilder.defineProps(DualSlider.propTypes);

// ----------
// ## <section id="builders">Built-in builders</section>
//
function slider() {
  return new SliderBuilder().withBackgroundColor(MKColor.Transparent);
}


// ## Public interface
module.exports = DualSlider;
DualSlider.Builder = SliderBuilder;
DualSlider.slider = slider;
