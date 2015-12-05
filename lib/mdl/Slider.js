//
// MDL style Slider component.
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


// ## <section id='Thumb'>Thumb</section>
// `Thumb` component of the [`Slider`](#Slider).
class Thumb extends Component {
  constructor(props) {
    super(props);
    this.x = 0;  // current x-axis position
    this._animatedLeft = new Animated.Value(0);
    this._animatedScale = new Animated.Value(1);
    this.state = {
      color: LOWEST_VALUE_THUMB_COLOR,
      borderColor: DEFAULT_UPPER_TRACK_COLOR,
    };
  }

  componentWillMount() {
    this._onRadiiUpdate(this.props);
    this.setState({
      borderColor: this.props.upperTrackColor,
      borderWidth: this.props.trackSize,
    });
  }

  componentWillReceiveProps(nextProps) {
    this._onRadiiUpdate(nextProps);
  }

  componentDidMount() {
    this._animatedLeft.addListener(this._getOnSliding());
  }

  componentWillUnmount() {
    this._animatedLeft.removeAllListeners();
  }

  // when thumb radii updated, re-calc the dimens
  _onRadiiUpdate(props) {
    this._radii = props.radius;
    this._dia = this._radii * 2;
    this._containerRadii = this._radii + THUMB_BORDER_WIDTH;
    this._containerDia = this._containerRadii * 2;
  }

  // return a memoized function to handle sliding animation events
  _getOnSliding() {
    let prevX = this.x;  // memorize the previous x

    // on sliding of the thumb
    // `value` - the `left` of the thumb, relative to the container
    return ({value}) => {
      // convert to value relative to the track
      const x = value + this._containerRadii - this.props.trackMarginH;

      if (prevX <= 0 && x > 0) {
        // leaving the lowest value, scale up the thumb
        this._onExplode();
      } else if (prevX > 0 && x <= 0) {
        // at lowest value, scale down the thumb
        this._onCollapse();
      }

      prevX = x;
    };
  }

  // animate the sliding
  // `x` - target position, relative to the track
  moveTo(x) {
    this.x = x;
    const x0 = this.x + this.props.trackMarginH;

    Animated.parallel([
      Animated.timing(this._animatedScale, {
        toValue: THUMB_SCALE_RATIO,
        duration: 100,
      }),
      Animated.timing(this._animatedLeft, {
        toValue: x0 - this._containerRadii,
        duration: 0,
      }),
    ]).start();
  }

  // stop sliding
  confirmMoveTo() {
    Animated.timing(this._animatedScale, {
      toValue: 1,
      duration: 100,
    }).start();
  }

  // from 'lowest' to 'non-lowest'
  _onExplode() {
    this.setState({
      borderColor: this.props.lowerTrackColor,
      color: this.props.lowerTrackColor,
    });
  }

  // from 'non-lowest' to 'lowest'
  _onCollapse() {
    this.setState({
      borderColor: this.props.upperTrackColor,
      color: LOWEST_VALUE_THUMB_COLOR,
    });
  }

  // Rendering the `Thumb`
  render() {
    return (
      <Animated.View style={[  // the outer circle to draw the border
          this.props.style,
          {
            width: this._containerDia,
            height: this._containerDia,
            backgroundColor: this.state.borderColor,
            borderRadius: this._containerRadii,
            position: 'absolute',
            left: this._animatedLeft,
            transform: [
              {scale: this._animatedScale},
            ],
          },
        ]}
        >
        <View style={{  // the inner circle
            width: this._dia,
            height: this._dia,
            backgroundColor: this.state.color,
            borderRadius: this._radii,
            top: THUMB_BORDER_WIDTH,
            left: THUMB_BORDER_WIDTH,
          }}
          />
      </Animated.View>
    );
  }
}


// ## <section id='Slider'>Slider</section>
class Slider extends Component {
  constructor(props) {
    super(props);
    this._value = 0;
    this._trackTotalLength = 0;
    this._prevPointerX = 0;
    this._animatedTrackLength = new Animated.Value(0);
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
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
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this._onPanResponderEnd(gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this._onPanResponderEnd(gestureState, true);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    });
  }

  componentWillMount() {
    this._onThumbRadiiUpdate(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._onThumbRadiiUpdate(nextProps);
  }

  _onTrackLayout({nativeEvent: {layout: {width}}}) {
    if (this._trackTotalLength !== width) {
      this._trackTotalLength = width;
      this._aniUpdateValue(this.value);
    }
  }

  _internalSetValue(value, fireChange=true) {
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
      type: cancelled ? 'TOUCH_CANCEL' : 'TOUCH_DOWN',
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
    }
  }

  // get touch position relative to the track
  _getTouchOnTrack(evt) {
    // touch location relative to the track
    let x = Math.max(evt.x - this._trackMarginH, 0);
    x = Math.min(x, this._trackTotalLength);

    const ratio = x / this._trackTotalLength;

    return {x, ratio};
  }

  _updateValueByTouch(evt) {
    const {x, ratio} = this._getTouchOnTrack(evt);
    const _value = ratio * (this.props.max - this.props.min) + this.props.min;
    this._internalSetValue(_value);  // report changes in 'real-time'
    this._moveThumb(x);
  }

  _confirmUpdateValueByTouch(evt) {
    if (evt) {
      const {x} = this._getTouchOnTrack(evt);
      this._confirmMoveThumb(x);
    } else {
      this._confirmMoveThumb();
    }
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
            pointerEvents="box-only"
            {...this._panResponder.panHandlers}
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
              width: this._animatedTrackLength,
              height: this.props.trackSize,
              backgroundColor: this.props.lowerTrackColor || getTheme().primaryColor,
            }}
            />
        </View>
        <Thumb
          ref="thumb"
          radius={this.props.thumbRadius}
          trackSize={this.props.trackSize}
          trackMarginH={this._trackMarginH}
          lowerTrackColor={this.props.lowerTrackColor || getTheme().primaryColor}
          upperTrackColor={this.props.upperTrackColor}
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
  set: function (value) {
    this._internalSetValue(value);
    this._aniUpdateValue(value);
  },
  get: function () {
    return this._value;
  },
  enumerable: true,
});

// ## <section id='props'>Props</section>
Slider.propTypes = {
  // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Minimum value of the range, default is `0`
  min: PropTypes.number,

  // Maximum value of the range, default is `100`
  max: PropTypes.number,

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
};

// ## <section id='defaults'>Defaults</section>
Slider.defaultProps = {
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
// ## Slider builder
//
class SliderBuilder extends Builder {
  build() {
    const BuiltSlider = class extends Slider {};
    BuiltSlider.defaultProps = Object.assign({}, Slider.defaultProps, this.toProps());
    return BuiltSlider;
  }
}

// define builder method for each prop
SliderBuilder.defineProps(Slider.propTypes);

// ----------
// ## <section id="builders">Built-in builders</section>
//
function slider() {
  return new SliderBuilder().withBackgroundColor(MKColor.Transparent);
}


// ## Public interface
module.exports = Slider;
Slider.Builder = SliderBuilder;
Slider.slider = slider;
