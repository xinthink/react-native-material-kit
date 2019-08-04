import React, { Component } from 'react';

import {
  Animated,
  StyleProp,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import MKColor from '../MKColor';

export type ThumbProps = {
  checked: boolean;
  onColor?: string;
  offColor?: string;
  rippleColor?: string;
  rippleAniDuration: number;
  rippleRadius: number;
  thumbStyle?: StyleProp<ViewStyle>;
} & ViewProps;

interface ThumbState {
  checked: boolean;
}

const defaultProps: ThumbProps = {
  checked: false,
  pointerEvents: 'none',
  rippleAniDuration: 250,
  rippleRadius: 14,
  style: {
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },
};

// ## <section id='thumb'>Thumb</section>
// `Thumb` component of the [`Switch`](#switch).
// Which is displayed as a circle with shadow and ripple effect.
export class Thumb extends Component<ThumbProps, ThumbState> {
  // Default props of `Thumb`
  static defaultProps: ThumbProps = defaultProps;

  private animatedRippleScale = new Animated.Value(0);
  private animatedRippleAlpha = new Animated.Value(0);
  private rippleAni?: Animated.CompositeAnimation;
  private pendingRippleAni?: () => void; // pending animation process, if any

  constructor(props: ThumbProps) {
    super(props);
    this.state = {
      checked: props.checked,
    };
  }

  /**
   * TODO using controlled components.
   * @see https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html?#preferred-solutions
   */
  UNSAFE_componentWillReceiveProps(nextProps: ThumbProps) {
    if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
      this.setState({ checked: nextProps.checked });
    }
  }

  // When a toggle action started.
  startToggle() {
    this.showRipple();
  }

  // When a toggle action is finished (confirmed or canceled).
  endToggle() {
    this.hideRipple();
  }

  // When a toggle action (from the given state) is confirmed.
  // - {`boolean`} `fromState` the previous state
  confirmToggle(fromState: boolean) {
    this.setState({ checked: !fromState });
  }

  // Start the ripple effect
  showRipple() {
    // scaling up the ripple layer
    this.rippleAni = Animated.parallel([
      Animated.timing(this.animatedRippleAlpha, {
        duration: this.props.rippleAniDuration,
        toValue: 1,
      }),
      Animated.timing(this.animatedRippleScale, {
        duration: this.props.rippleAniDuration,
        toValue: 1,
      }),
    ]);

    this.rippleAni.start(() => {
      this.rippleAni = undefined;

      // if any pending animation, do it
      if (this.pendingRippleAni) {
        this.pendingRippleAni();
      }
    });
  }

  // Stop the ripple effect
  hideRipple() {
    this.pendingRippleAni = () => {
      Animated.parallel([
        Animated.timing(this.animatedRippleScale, {
          duration: this.props.rippleAniDuration || 250,
          toValue: 0,
        }),
        Animated.timing(this.animatedRippleAlpha, {
          duration: this.props.rippleAniDuration || 250,
          toValue: 0,
        }),
      ]).start();

      this.pendingRippleAni = undefined;
    };

    if (!this.rippleAni) {
      // previous ripple animation is done, good to go
      this.pendingRippleAni();
    }
  }

  // Rendering the `Thumb`
  render() {
    const rippleSize = this.props.rippleRadius * 2;

    return (
      <View
        style={[this.props.style, {
          backgroundColor: MKColor.Transparent,
          height: rippleSize,
          position: 'absolute',
          width: rippleSize,
        }]}
      >
        <View // the circle
          style={[
            defaultProps.style,
            this.props.thumbStyle,
            {backgroundColor: this.state.checked ? this.props.onColor : this.props.offColor},
          ]}
        />
        <Animated.View // the ripple layer
          style={{
            height: rippleSize,
            left: 0,
            top: 0,
            width: rippleSize,

            backgroundColor: this.props.rippleColor,
            borderRadius: this.props.rippleRadius,
            opacity: this.animatedRippleAlpha,
            position: 'absolute',
            transform: [
              { scale: this.animatedRippleScale },
            ],
          }}
        />
      </View>
    );
  }
}

// Enable animations on `Thumb`
const AnimatedThumb = Animated.createAnimatedComponent(Thumb);
export default AnimatedThumb
