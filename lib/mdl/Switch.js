/* eslint react/no-multi-comp:0, react/prop-types:0 */
//
// MDL style switch component.
//
// <image src="http://bit.ly/1OF6Z96" width="400"/>
//
// - @see [MDL Switch](http://bit.ly/1IcHMPo)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/7/28.
//

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  Animated,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import MKColor from '../MKColor';
import * as utils from '../utils';
import { getTheme } from '../theme';

// ## <section id='thumb'>Thumb</section>
// `Thumb` component of the [`Switch`](#switch).
// Which is displayed as a circle with shadow and ripple effect.
class Thumb extends Component {
  static propTypes = {
    // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
    ...View.propTypes,
    checked: PropTypes.bool,
    onColor: PropTypes.string,
    offColor: PropTypes.string,
    rippleColor: PropTypes.string,
    rippleAniDuration: PropTypes.number,
    rippleRadius: PropTypes.number,
    thumbStyle: PropTypes.any,
  };

  // Default props of `Thumb`
  static defaultProps = {
    pointerEvents: 'none',
    style: {
      shadowColor: 'black',
      shadowRadius: 1,
      shadowOpacity: 0.7,
      shadowOffset: { width: 0, height: 1 },
    },
  };

  constructor(props) {
    super(props);
    this._animatedRippleScale = new Animated.Value(0);
    this._animatedRippleAlpha = new Animated.Value(0);
    this.state = {
      checked: false,
    };
  }

  componentWillMount() {
    this.setState({ checked: this.props.checked });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({ checked: nextProps.checked });
    }
  }

  // When a toggle action started.
  startToggle() {
    this.showRipple();
  }

  // When a toggle action (from the given state) is confirmed.
  // - {`boolean`} `fromState` the previous state
  confirmToggle(fromState) {
    this.setState(
      {
        checked: !fromState,
      }
    );
  }

  // When a toggle action is finished (confirmed or canceled).
  endToggle() {
    this.hideRipple();
  }

  // Start the ripple effect
  showRipple() {
    // scaling up the ripple layer
    this._rippleAni = Animated.parallel([
      Animated.timing(this._animatedRippleAlpha, {
        toValue: 1,
        duration: this.props.rippleAniDuration || 250,
      }),
      Animated.timing(this._animatedRippleScale, {
        toValue: 1,
        duration: this.props.rippleAniDuration || 250,
      }),
    ]);

    this._rippleAni.start(() => {
      this._rippleAni = undefined;

      // if any pending animation, do it
      if (this._pendingRippleAni) {
        this._pendingRippleAni();
      }
    });
  }

  // Stop the ripple effect
  hideRipple() {
    this._pendingRippleAni = () => {
      Animated.parallel([
        Animated.timing(this._animatedRippleScale, {
          toValue: 0,
          duration: this.props.rippleAniDuration || 250,
        }),
        Animated.timing(this._animatedRippleAlpha, {
          toValue: 0,
          duration: this.props.rippleAniDuration || 250,
        }),
      ]).start();

      this._pendingRippleAni = undefined;
    };

    if (!this._rippleAni) {
      // previous ripple animation is done, good to go
      this._pendingRippleAni();
    }
  }

  _getBgColor() {
    return this.state.checked ? this.props.onColor : this.props.offColor;
  }

  // Rendering the `Thumb`
  render() {
    const rippleSize = this.props.rippleRadius * 2;

    return (
      <View ref="container"
        style={[this.props.style, {
          position: 'absolute',
          width: rippleSize,
          height: rippleSize,
          backgroundColor: MKColor.Transparent,
        }]}
      >
        <View  // the circle
          style={[
            Thumb.defaultProps.style,
            this.props.thumbStyle,
            { backgroundColor: this._getBgColor() },
          ]}
        />
        <Animated.View  // the ripple layer
          style={{
            position: 'absolute',
            opacity: this._animatedRippleAlpha,
            backgroundColor: this.props.rippleColor,
            width: rippleSize,
            height: rippleSize,
            borderRadius: this.props.rippleRadius,
            top: 0,
            left: 0,
            transform: [
              { scale: this._animatedRippleScale },
            ],
          }}
        />
      </View>
    );
  }
}

// Enable animations on `Thumb`
const AnimatedThumb = Animated.createAnimatedComponent(Thumb);


// ## <section id='switch'>Switch</section>
// The `Switch` component. Which is made up of a `Track` and a [`Thumb`](#thumb).
class Switch extends Component {
  constructor(props) {
    super(props);
    this.theme = getTheme();
    this._animatedThumbLeft = new Animated.Value(0);
    this.state = {
      trackSize: 0,
      trackLength: 0,
      trackRadii: 0,
      trackMargin: 0,
      thumbFrame: { x: 0, padding: 0, r: 0, rippleRadii: 0 },
      checked: false,
    };
  }

  componentWillMount() {
    const nextState = this._layoutThumb(this.props.checked,
      this.props.thumbRadius,
      this.props.trackLength,
      this.props.trackSize);
    this.setState(Object.assign(nextState, { checked: this.props.checked }));
  }

  componentWillReceiveProps(nextProps) {
    const nextState = this._layoutThumb(nextProps.checked,
      nextProps.thumbRadius,
      nextProps.trackLength,
      nextProps.trackSize);
    this.setState(Object.assign(nextState, { checked: nextProps.checked }));
  }

  // Un-boxing the `Thumb` node from `AnimatedComponent`,
  // in order to access the component functions defined in `Thumb`
  getThumb() {
    if (typeof this.refs.thumb.refs.node !== 'undefined') {
      return this.refs.thumb.refs.node;
    }
    return this.refs.thumb._component;
  }

  // property initializers begin
  _onPress = () => {
    this.confirmToggle();
    if (this.props.onPress) {
      this.props.onPress();
    }
  };

  _onPressIn = () => {
    this.startToggle();
    if (this.props.onPressIn) {
      this.props.onPressIn();
    }
  };

  _onPressOut = () => {
    this.endToggle();
    if (this.props.onPressOut) {
      this.props.onPressOut();
    }
  };
  // property initializers end

  // Layout the thumb according to the size of the track
  _layoutThumb(checked, thumbRadius, trackLength, trackSize) {
    const trackRadii = trackSize / 2;
    const thumbRadii = thumbRadius;
    const rippleRadii = trackLength - trackSize;
    const trackMargin = rippleRadii - trackRadii;  // make room for ripple
    const thumbLeft = checked ? trackMargin + trackRadii : 0;
    this._animatedThumbLeft.setValue(thumbLeft);

    return {
      trackSize,
      trackLength,
      trackRadii,
      trackMargin,
      thumbFrame: {
        rippleRadii,
        x: thumbLeft,
        r: thumbRadii,
        padding: rippleRadii - thumbRadii,
      },
    };
  }

  // Move the thumb left or right according to the current state
  _translateThumb() {
    this._animatedThumbLeft.setValue(this.state.thumbFrame.x);
    const newX = this._computeThumbX(this.state.checked);
    Animated.timing(this._animatedThumbLeft, {
      toValue: newX,
      duration: this.props.thumbAniDuration || 300,
    }).start(() => {
      this.state.thumbFrame.x = newX;
    });
  }

  // Calc the next position (x-axis) of the thumb
  _computeThumbX(toChecked) {
    if (!this.state.thumbFrame.r) {
      return 0;
    }

    const { trackLength, trackSize } = this.state;
    const dx = (toChecked ? 1 : -1) * (trackLength - trackSize);
    return this.state.thumbFrame.x + dx;
  }

  // When a toggle action started.
  startToggle() {
    this.getThumb().startToggle();
  }

  // When a toggle action is confirmed.
  confirmToggle() {
    const prevState = this.state.checked;
    this.setState({ checked: !prevState }, () => {
      this.getThumb().confirmToggle(prevState);
      this._translateThumb();

      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({ checked: this.state.checked });
      }
    });
  }

  // When a toggle action is finished (confirmed or canceled).
  endToggle() {
    this.getThumb().endToggle();
  }

  _getBgColor(theme) {
    const onColor = this.props.onColor || theme.onColor;
    const offColor = this.props.offColor || theme.offColor;
    return this.state.checked ? onColor : offColor;
  }

  // Rendering the `Switch`
  render() {
    const touchProps = {
      delayPressIn: this.props.delayPressIn,
      delayPressOut: this.props.delayPressOut,
      delayLongPress: this.props.delayLongPress,
      onLongPress: this.props.onLongPress,
    };

    const mergedStyle = Object.assign({}, this.theme.switchStyle, utils.compact({
      onColor: this.props.onColor,
      offColor: this.props.offColor,
      thumbOnColor: this.props.thumbOnColor,
      thumbOffColor: this.props.thumbOffColor,
      rippleColor: this.props.rippleColor,
    }));

    const thumbFrame = this.state.thumbFrame;
    const thumbProps = {
      checked: this.state.checked,
      onColor: mergedStyle.thumbOnColor,
      offColor: mergedStyle.thumbOffColor,
      rippleColor: mergedStyle.rippleColor,
      rippleRadius: thumbFrame.rippleRadii,
      rippleAniDuration: this.props.rippleAniDuration,
      radius: this.props.thumbRadius,
      style: {
        left: this._animatedThumbLeft,
        top: 0,
      },
      thumbStyle: {
        width: this.props.thumbRadius * 2,
        height: this.props.thumbRadius * 2,
        borderRadius: this.props.thumbRadius,
        top: thumbFrame.padding,
        left: thumbFrame.padding,
      },
    };

    return (
      <TouchableWithoutFeedback
        {...touchProps}
        onPress={this._onPress}
        onPressIn={this._onPressIn}
        onPressOut={this._onPressOut}
      >
        <View ref="container"
          pointerEvents="box-only"
          style={this.props.style}
        >
          <View ref="track"  // the 'track' part
            style={{
              width: this.props.trackLength,
              height: this.props.trackSize,
              backgroundColor: this._getBgColor(mergedStyle),
              borderRadius: this.state.trackRadii,
              margin: this.state.trackMargin,
            }}
          />
          <AnimatedThumb ref="thumb"  // the 'thumb' part
            {...thumbProps}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// ## <section id='props'>Props</section>
Switch.propTypes = {
  // Touchable...
  ...TouchableWithoutFeedback.propTypes,

  // Toggle status of the `Switch`
  checked: PropTypes.bool,

  // Callback when the toggle status is changed.
  onCheckedChange: PropTypes.func,

  // Color of the track, when switch is checked
  onColor: PropTypes.string,

  // Color of the track, when switch is off
  offColor: PropTypes.string,

  // The thickness of the Switch track
  trackSize: PropTypes.number,

  // The length of the Switch track
  trackLength: PropTypes.number,

  // Radius of the thumb button
  thumbRadius: PropTypes.number,

  // Color of the thumb, when switch is checked
  thumbOnColor: PropTypes.string,

  // Color of the thumb, when switch is off
  thumbOffColor: PropTypes.string,

  // Duration of the thumb sliding animation, in milliseconds
  thumbAniDuration: PropTypes.number,

  // Color of the ripple layer
  rippleColor: PropTypes.string,

  // Duration of the ripple effect, in milliseconds
  rippleAniDuration: PropTypes.number,
};

// ## <section id='defaults'>Defaults</section>
Switch.defaultProps = {
  checked: false,
  trackLength: 48,
  trackSize: 20,
  thumbRadius: 14,
};


// ## Public interface
module.exports = Switch;
