/**
 * MDL style Switch component.
 *
 * <image src="http://bit.ly/1OF6Z96">
 * @see {@link http://bit.ly/1IcHMPo|MDL Switch}
 *
 * Created by ywu on 15/7/28.
 */

const React = require('react-native');
const MKColor = require('../MKColor');

const {
  Component,
  Animated,
  View,
  TouchableWithoutFeedback,
} = React;

/**
 * Thumb component of the Switch.
 * Which is displayed as a circle with shadow and ripple effect.
 * @class
 */
class Thumb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rippleScale: new Animated.Value(1),
      rippleAlpha: new Animated.Value(0),
    };
  }

  componentWillMount() {
    this.setState({checked: this.props.checked});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({checked: nextProps.checked});
    }
  }

  /**
   * When a toggle action started.
   */
  startToggle() {
    this.showRipple();
  }

  /**
   * When a toggle action is confirmed.
   * @param {boolean} fromState a toggle from the given state has been confirmed
   */
  confirmToggle(fromState) {
    this.state.checked = !fromState;
  }

  /**
   * When a toggle action is finished (confirmed or canceled).
   */
  endToggle() {
    this.hideRipple();
  }

  showRipple() {
    this.state.rippleAlpha.setValue(1);
    this.state.rippleScale.setValue(0);

    this._rippleAni = Animated.timing(this.state.rippleScale, {
      toValue: 1,
      duration: this.props.rippleAniDuration || 150,
    });

    this._rippleAni.start(() => {
      this._rippleAni = undefined;

      // if any pending animation, do it
      if (this._pendingRippleAni) {
        this._pendingRippleAni();
      }
    });
  }

  hideRipple() {
    this._pendingRippleAni = () => {
      Animated.timing(this.state.rippleAlpha, {
        toValue: 0,
        duration: 100,
      }).start();

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

  render() {
    return (
      <View  // the circle
        style={[
          Thumb.defaultProps.style,
          this.props.style,
          {backgroundColor: this._getBgColor()},
        ]}
        >
        <Animated.View  // the ripple layer
          style={{
            opacity: this.state.rippleAlpha,
            backgroundColor: this.props.rippleColor,
            width: this.props.rippleRadius * 2,
            height: this.props.rippleRadius * 2,
            borderRadius: this.props.rippleRadius,
            top: -this.props.rippleRadius / 2,
            left: -this.props.rippleRadius / 2,
            transform: [
              {scale: this.state.rippleScale},
            ],
          }}
        />
      </View>
    );
  }
}

Thumb.defaultProps = {
  pointerEvents: 'none',
  onColor: MKColor.Indigo,
  offColor: MKColor.Silver,
  rippleColor: 'rgba(63,81,181,0.2)',  // Indigo + alpha
  style: {
    shadowColor: 'black',
    shadowRadius: 1,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 1 },
  },
};

const AnimatedThumb = Animated.createAnimatedComponent(Thumb);


/**
 * The Switch component. Which is made up of a Track & a {@link Thumb}.
 * @class
 */
class Switch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trackWidth: 0,
      trackHeight: 0,
      trackRadii: 0,
      thumbLeft: new Animated.Value(0),
      thumbFrame: {x: 0, y: 0, r: 0, rippleRadii: 0},
    };
  }

  componentWillMount() {
    this.setState({checked: this.props.checked});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({checked: nextProps.checked});
    }
  }

  componentDidMount() {
    requestAnimationFrame(this._doMeasurement.bind(this));
  }

  _doMeasurement() {
    this.refs.track.measure(this._layoutThumb.bind(this));
  }

  // layout the thumb according to the size of the track
  _layoutThumb(x, y, trackWidth, trackHeight) {
    const trackRadii = trackHeight / 2;
    const thumbRadii = this.props.thumbRadius;
    const thumbX0 = this.state.checked ? trackWidth - trackRadii : trackRadii;
    this.state.thumbLeft.setValue(thumbX0 - thumbRadii);
    this.setState({
      trackWidth,
      trackHeight,
      trackRadii,
      thumbFrame: {
        x: thumbX0 - thumbRadii,
        y: trackRadii - thumbRadii,
        r: thumbRadii,
        rippleRadii: trackWidth - trackRadii * 2,
      },
    });
  }

  // move the thumb left or right according to the current state
  _translateThumb() {
    this.state.thumbLeft.setValue(this.state.thumbFrame.x);
    const newX = this._computeThumbX(this.state.checked);
    Animated.timing(this.state.thumbLeft, {
      toValue: newX,
      duration: this.props.thumbAniDuration || 300,
    }).start(() => {
      this.state.thumbFrame.x = newX;
    });
  }

  // calc the next position (x-axis) of the thumb
  _computeThumbX(toChecked) {
    if (!this.state.thumbFrame.r) {
      return 0;
    }

    const {trackWidth, trackRadii} = this.state;
    const dx = (toChecked ? 1 : -1) * (trackWidth - trackRadii * 2);
    return this.state.thumbFrame.x + dx;
  }

  /**
   * When a toggle action started.
   */
  startToggle() {
    this.getThumb().startToggle();
  }

  /**
   * When a toggle action is confirmed.
   */
  confirmToggle() {
    const prevState = this.state.checked;
    this.setState({checked: !prevState}, () => {
      this.getThumb().confirmToggle(prevState);
      this._translateThumb();

      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({checked: this.state.checked});
      }
    });
  }

  /**
   * When a toggle action is finished (confirmed or canceled).
   */
  endToggle() {
    this.getThumb().endToggle();
  }

  /**
   * Unwrap the Thumb node from AnimatedComponent,
   * in order to access the component function defined in {@link Thumb}
   * @returns {Thumb}
   */
  getThumb() {
    return this.refs.thumb.refs.node;
  }

  _getBgColor() {
    return this.state.checked ? this.props.onColor : this.props.offColor;
  }

  _onPress() {
    this.confirmToggle();
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  _onPressIn() {
    this.startToggle();
    if (this.props.onPressIn) {
      this.props.onPressIn();
    }
  }

  _onPressOut() {
    this.endToggle();
    if (this.props.onPressOut) {
      this.props.onPressOut();
    }
  }

  render() {
    const touchProps = {
      delayPressIn: this.props.delayPressIn,
      delayPressOut: this.props.delayPressOut,
      delayLongPress: this.props.delayLongPress,
      onLongPress: this.props.onLongPress,
    };

    const thumbFrame = this.state.thumbFrame;
    const thumbProps = {
      checked: this.state.checked,
      onColor: this.props.thumbOnColor,
      offColor: this.props.thumbOffColor,
      rippleColor: this.props.rippleColor,
      rippleRadius: thumbFrame.rippleRadii,
      rippleAniDuration: this.props.rippleAniDuration,
      style: {
        left: this.state.thumbLeft,
        top: thumbFrame.y,
        width: this.props.thumbRadius * 2,
        height: this.props.thumbRadius * 2,
        borderRadius: this.props.thumbRadius,
      },
    };

    return (
      <TouchableWithoutFeedback
        {...touchProps}
        onPress={this._onPress.bind(this)}
        onPressIn={this._onPressIn.bind(this)}
        onPressOut={this._onPressOut.bind(this)}
        >
        <View ref="track"  // the 'track' part of the Switch
              style={[Switch.defaultProps.style,
                      this.props.style,
                      {
                        backgroundColor: this._getBgColor(),
                        borderRadius: this.state.trackRadii,
                      },
                    ]}
          >
          <AnimatedThumb ref="thumb"  // the 'thumb' part of the Switch
            {...thumbProps}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

/**
 * Props of Switch
 */
Switch.propTypes = {
  ...TouchableWithoutFeedback.propTypes,
  checked: React.PropTypes.bool,
  /**
   * Callback when the toggle state is changed.
   */
  onCheckedChange: React.PropTypes.func,
  /**
   * Color of the track, when switch is checked
   */
  onColor: React.PropTypes.string,
  /**
   * Color of the track, when switch is off
   */
  offColor: React.PropTypes.string,
  /**
   * Radius of the thumb button
   */
  thumbRadius: React.PropTypes.number,
  /**
   * Color of the thumb, when switch is checked
   */
  thumbOnColor: React.PropTypes.string,
  /**
   * Color of the thumb, when switch is off
   */
  thumbOffColor: React.PropTypes.string,
  /**
   * Duration of the thumb sliding animation, in milliseconds
   */
  thumbAniDuration: React.PropTypes.number,
  /**
   * Color of the ripple layer
   */
  rippleColor: React.PropTypes.string,
  /**
   * Duration of the ripple effect, in milliseconds
   */
  rippleAniDuration: React.PropTypes.number,
};

/**
 * Defaults
 */
Switch.defaultProps = {
  checked: false,
  onColor: 'rgba(63,81,181,0.4)',  // Indigo + alpha
  offColor: 'rgba(0,0,0,0.25)',
  thumbRadius: 10,
  thumbOnColor: MKColor.Indigo,
  thumbOffColor: MKColor.Silver,
  rippleColor: 'rgba(63,81,181,0.2)',  // Indigo + alpha
  style: {
    width: 36,
    height: 14,
    borderRadius: 7,
  },
};


// Public interface
module.exports = Switch;
