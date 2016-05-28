//
// RangeSlider component.
//
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by awaidman on 16/1/21.
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

// Default color of the upper part of the track
const DEFAULT_UPPER_TRACK_COLOR = '#cccccc';

// Color of the thumb when lowest value is chosen
const LOWEST_VALUE_THUMB_COLOR = 'white';

// The max scale of the thumb
const THUMB_SCALE_RATIO = 1.3;

// Width of the thumb border
const THUMB_BORDER_WIDTH = 2;

// extra spacing enlarging the touchable area
const TRACK_EXTRA_MARGIN_H = 5;

// ## <section id='Thumb'>Thumb</section>
// `Thumb` component of the [`Slider`](#Slider).
class Thumb extends Component {
  constructor(props) {
    super(props);
    this.x = 0;  // current x-axis position

    this._trackMarginH = (props.radius + THUMB_BORDER_WIDTH) * THUMB_SCALE_RATIO +
      TRACK_EXTRA_MARGIN_H;
    this._panResponder = {};
    this._animatedLeft = new Animated.Value(0);
    this._animatedScale = new Animated.Value(1);
    this.state = {
      color: LOWEST_VALUE_THUMB_COLOR,
      borderColor: DEFAULT_UPPER_TRACK_COLOR,
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: (evt) => { this.props.onGrant(this, evt); },
      onPanResponderMove: (evt) => { this.props.onMove(this, evt); },
      onPanResponderRelease: (evt) => { this.props.onEnd(this, evt); },
      onPanResponderTerminate: (evt) => { this.props.onEnd(this, evt); },
    });

    this._onRadiiUpdate(this.props);
    this.setState({
      borderColor: this.props.disabledColor,
    });
  }

  componentDidMount() {
    this._animatedLeft.addListener(this._getOnSliding());
  }

  componentWillReceiveProps(nextProps) {
    this._onRadiiUpdate(nextProps);
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
    return ({ value }) => {
      // convert to value relative to the track
      const x = value + this._containerRadii - this._trackMarginH;

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
    const x0 = this.x + this._trackMarginH;

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
      borderColor: this.props.enabledColor,
      color: this.props.enabledColor,
    });
  }

  // from 'non-lowest' to 'lowest'
  _onCollapse() {
    this.setState({
      borderColor: this.props.disabledColor,
      color: LOWEST_VALUE_THUMB_COLOR,
    });
  }

  // Rendering the `Thumb`
  render() {
    return (
      <Animated.View
        style={[  // the outer circle to draw the border
          this.props.style,
          {
            width: this._containerDia,
            height: this._containerDia,
            backgroundColor: this.state.borderColor,
            borderRadius: this._containerRadii,
            position: 'absolute',
            left: this._animatedLeft,
            transform: [
              { scale: this._animatedScale },
            ],
          },
        ]}
        { ...this._panResponder.panHandlers }
      >
        <View
          style={{  // the inner circle
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

Thumb.propTypes = {
  // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Callback to handle onPanResponderGrant gesture
  onGrant: PropTypes.func,

  // Callback to handle onPanResponderMove gesture
  onMove: PropTypes.func,

  // Callback to handle onPanResponderRelease/Terminate gesture
  onEnd: PropTypes.func,

  // Color when thumb has no value
  disabledColor: PropTypes.string,

  // Color when thumb has value
  enabledColor: PropTypes.string,

  // Radius of thumb component
  radius: PropTypes.number,
};

// ## <section id='defaults'>Defaults</section>
Thumb.defaultProps = {
  radius: 6,
  disabledColor: DEFAULT_UPPER_TRACK_COLOR,
};

// ## Public interface
module.exports = Thumb;
