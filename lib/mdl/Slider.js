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
const utils = require('../utils');

const {
  Component,
  Animated,
  View,
  PropTypes,
} = React;


// Default color of the upper part of the track
const DEFAULT_UPPER_TRACK_COLOR = 'rgba(0,0,0,0.25)';

// Color of the thumb when lowest value is chosen
const LOWEST_VALUE_THUMB_COLOR = 'white';


// ## <section id='Thumb'>Thumb</section>
// `Thumb` component of the [`Slider`](#Slider).
class Thumb extends Component {
  constructor(props) {
    super(props);
    this.x = 0;  // current x-axis position
    this.trackLenght = 0;
    this._animatedLeft = new Animated.Value(0);
    this._animatedScale = new Animated.Value(1);
    this._animatedBorder = new Animated.Value(utils.toPixels(1));  // 1 dp
    this.state = {
      color: LOWEST_VALUE_THUMB_COLOR,
      borderColor: DEFAULT_UPPER_TRACK_COLOR,
      padding: utils.toPixels(1),  // 1 dp
    };
  }

  componentWillMount() {
    this.setState({
      borderColor: this.props.upperTrackColor,
      borderWidth: this.props.trackSize,
    });
  }

  componentDidMount() {
    this._animatedLeft.addListener(this._getOnSliding());
  }

  componentWillUnmount() {
    this._animatedLeft.removeAllListeners();
  }

  _getOnSliding() {
    let prevX = this.x;  // memorize the previous x

    return ({value}) => {
      const x = value + this.props.radius;

      if (prevX <= 0 && x > 0) {
        // leaving the lowest position, scale up the thumb
        this._onExplode();
      } else if (prevX > 0 && x <= 0) {
        // lowest position, scale down the thumb
        this._onCollapse();
      }

      prevX = x;
    };
  }

  // animate the sliding
  moveTo(x) {
    this.x = Math.max(x, 0);
    this.x = Math.min(this.x, this.trackLenght);

    Animated.parallel([
      Animated.timing(this._animatedScale, {
        toValue: 1.5,
        duration: 100,
      }),
      Animated.timing(this._animatedBorder, {
        toValue: utils.toPixels(0.5),
        duration: 100,
      }),
      Animated.timing(this._animatedLeft, {
        toValue: this.x - this.props.radius,
        duration: 0,
      }),
    ]).start();
  }

  // release the sliding
  confirmMoveTo() {
    Animated.parallel([
      Animated.timing(this._animatedScale, {
        toValue: 1,
        duration: 100,
      }),
      Animated.timing(this._animatedBorder, {
        toValue: utils.toPixels(1),
        duration: 100,
      }),
    ]).start();
  }

  // from 'lowest' to 'non-lowest'
  _onExplode() {
    this.setState({
      borderColor: MKColor.Transparent,
      color: this.props.lowerTrackColor,
    });
  }

  // from 'non-lowest' to 'lowest'
  _onCollapse() {
    this.setState({
      borderColor: this.props.upperTrackColor,
      // FIXME make it transparent
      color: LOWEST_VALUE_THUMB_COLOR,
    });
  }

  // Rendering the `Thumb`
  render() {
    return (
      <Animated.View style={[
          this.props.style,
          {
            backgroundColor: MKColor.Transparent,
            padding: this.state.padding,  // extends the touchable area
            position: 'absolute',
            left: this._animatedLeft,
            transform: [
              {scale: this._animatedScale},
            ],
          },
        ]}
        >
        <Animated.View style={{
            flex: 1,
            borderRadius: this.props.radius - this.state.padding,
            width: (this.props.radius - this.state.padding) * 2,
            height: (this.props.radius - this.state.padding) * 2,
            borderWidth: this._animatedBorder,
            backgroundColor: this.state.color,
            borderColor: this.state.borderColor,
          }}
          />
      </Animated.View>
    );
  }
}

// Default props of `Thumb`
Thumb.defaultProps = {
  pointerEvents: 'none',
};


// ## <section id='Slider'>Slider</section>
class Slider extends Component {
  constructor(props) {
    super(props);
    this._value = 0;
    this._trackTotalWidth = 0;
    this._animatedTrackWidth = new Animated.Value(0);
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      if (!this.refs.track) {
        return;
      }

      this.refs.track.measure((left, top, width) => {
        this._trackTotalWidth = width;
        this._aniUpdateValue(this.value);
      });
    });
  }

  // Public api to update the current value
  set value(value) {
    this._internalSetValue(value);
    this._aniUpdateValue(value);
  }

  get value() {
    return this._value;
  }

  _internalSetValue(value, fireChange=true) {
    this._value = value;
    if (fireChange) {
      this._fireChange(value);
    }
  }

  _fireChange(newValue) {
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  _aniUpdateValue(value) {
    if (!this._trackTotalWidth) {
      return;
    }

    this.refs.thumb.trackLenght = this._trackTotalWidth;

    const ratio = (value - this.props.min) / (this.props.max - this.props.min);
    const x = ratio * this._trackTotalWidth;
    this._moveThumb(x);
    this._confirmMoveThumb(x);
  }

  // The View is now responding for touch events.
  _onResponderGrant(evt) {
    this._updateValueByTouch(evt);
  }

  // Something else is the responder right now and will not release it
  _onResponderReject(evt) {
    this._confirmUpdateValueByTouch(evt);
  }

  // The user is moving their finger
  _onResponderMove(evt) {
    this._updateValueByTouch(evt);
  }

  // Fired at the end of the touch, ie "touchUp"
  _onResponderRelease(evt) {
    this._confirmUpdateValueByTouch(evt);
  }

  // The responder has been taken from the View.
  _onResponderTerminate(evt) {
    this._confirmUpdateValueByTouch(evt);
  }

  // get touch position relative to the track
  _getTouchOnTrack(evt) {
    const padding = this.props.thumbRadius;
    let x = Math.max(evt.locationX - padding, 0);
    x = Math.min(x, this._trackTotalWidth);

    const ratio = x / this._trackTotalWidth;

    return {x, ratio};
  }

  _updateValueByTouch(evt) {
    const {x, ratio} = this._getTouchOnTrack(evt.nativeEvent);
    this._internalSetValue(ratio * (this.props.max - this.props.min) + this.props.min);
    this._moveThumb(x);
  }

  _confirmUpdateValueByTouch(evt) {
    const {x} = this._getTouchOnTrack(evt.nativeEvent);
    this._confirmMoveThumb(x);
  }

  _moveThumb(x) {
    this.refs.thumb.moveTo(x);

    Animated.timing(this._animatedTrackWidth, {
      toValue: x,
      duration: 0,
    }).start();
  }

  _confirmMoveThumb(x) {
    this.refs.thumb.confirmMoveTo(x);
  }

  render() {
    return (
      <View ref="container"  // extends the touchable area
            style={[{
                paddingTop: this.props.thumbRadius - this.props.trackSize / 2,
                paddingBottom: this.props.thumbRadius - this.props.trackSize / 2,
                paddingLeft: this.props.thumbRadius,
                paddingRight: this.props.thumbRadius,
              },
              this.props.style,
            ]}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => false}
            onResponderGrant={this._onResponderGrant.bind(this)}
            onResponderReject={this._onResponderReject.bind(this)}
            onResponderMove={this._onResponderMove.bind(this)}
            onResponderRelease={this._onResponderRelease.bind(this)}
            onResponderTerminationRequest={() => true}
            onResponderTerminate={this._onResponderTerminate.bind(this)}
        >
        <View ref="track"
              pointerEvents="none"
              style={{
                flex: 1,
                height: this.props.trackSize,
                backgroundColor: this.props.upperTrackColor,
              }}
          >
          <Animated.View
            ref="lowerTrack"
            style={{
              width: this._animatedTrackWidth,
              height: this.props.trackSize,
              backgroundColor: this.props.lowerTrackColor || getTheme().primaryColor,
            }}
            />
          <Thumb
            ref="thumb"
            radius={this.props.thumbRadius}
            trackWidth={this._trackTotalWidth}
            trackSize={this.props.trackSize}
            lowerTrackColor={this.props.lowerTrackColor || getTheme().primaryColor}
            upperTrackColor={this.props.upperTrackColor}
            style={{
              top: this.props.trackSize / 2 - this.props.thumbRadius,
            }}
            />
        </View>
      </View>
    );
  }
}

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
  thumbRadius: utils.toPixels(4),  // 4 dp
  trackSize: utils.toPixels(1),  // 1 dp
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
  return new SliderBuilder();
}


// ## Public interface
module.exports = Slider;
Slider.Builder = SliderBuilder;
Slider.slider = slider;
