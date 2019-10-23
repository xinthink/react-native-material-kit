/**
 * The `Thumb` part of {@link Slider} and {@link RangeSlider} components.
 *
 * Created by awaidman on 16/1/21.
 */
import React, { Component } from 'react';
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderInstance,
  View,
  ViewProps,
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

/** Gesture event callback for the `Thumb` component. see {@link GestureResponderEvent} */
export type ThumbGestureCallback = (thumb: Thumb, event: GestureResponderEvent) => void;

/** Props of {@link Thumb}, which extends {@link @types/react-native#ViewProps | ViewProps}  */
export interface ThumbProps extends ViewProps {
  /** Callback to handle onPanResponderGrant gesture */
  onGrant?: ThumbGestureCallback;

  /** Callback to handle onPanResponderMove gesture */
  onMove?: ThumbGestureCallback;

  /** Callback to handle onPanResponderRelease/Terminate gesture */
  onEnd?: ThumbGestureCallback;

  /** Color when thumb has no value */
  disabledColor?: string;

  /** Color when thumb has value */
  enabledColor?: string;

  /** Radius of thumb component */
  radius?: number;

  /** Padding for the hitSlop on the Thumb component */
  touchPadding?: number;
}

/** State of {@link Thumb} component */
interface ThumbState {
  color: any;
  borderColor: any;
}

/** Default props, see {@link ThumbProps} */
const defaultProps: ThumbProps = {
  radius: 6,
  disabledColor: DEFAULT_UPPER_TRACK_COLOR,
  touchPadding: 0,
};

/** `Thumb` component of {@link Slider} and {@link RangeSlider}. */
export default class Thumb extends Component<ThumbProps, ThumbState> {
  /** Defaults, see {@link defaultProps} */
  static defaultProps = defaultProps;

  /** current x-axis position */
  private x = 0;
  private _radii = 0;
  private _dia = 0;
  private _containerRadii = 0;
  private _containerDia = 0;
  private readonly _trackMarginH: number;
  private _panResponder = {} as PanResponderInstance;
  private _animatedLeft = new Animated.Value(0);
  private _animatedScale = new Animated.Value(1);

  constructor(props: ThumbProps) {
    super(props);
    this._trackMarginH =
      ((props.radius || 0) + THUMB_BORDER_WIDTH) * THUMB_SCALE_RATIO + TRACK_EXTRA_MARGIN_H;
    this.state = {
      color: LOWEST_VALUE_THUMB_COLOR,
      borderColor: DEFAULT_UPPER_TRACK_COLOR,
    };
  }

  UNSAFE_componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: e => this.props.onGrant && this.props.onGrant(this, e),
      onPanResponderMove: e => this.props.onMove && this.props.onMove(this, e),
      onPanResponderRelease: e => this.props.onEnd && this.props.onEnd(this, e),
      onPanResponderTerminate: e => this.props.onEnd && this.props.onEnd(this, e),
    });

    this._onRadiiUpdate(this.props);
    this.setState({
      borderColor: this.props.disabledColor,
    });
  }

  componentDidMount() {
    this._animatedLeft.addListener(this._getOnSliding());
  }

  UNSAFE_componentWillReceiveProps(nextProps: ThumbProps) {
    this._onRadiiUpdate(nextProps);
  }

  componentWillUnmount() {
    this._animatedLeft.removeAllListeners();
  }

  /**
   * animate the sliding
   * @param x target position, relative to the track
   */
  moveTo(x: number) {
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

  /** stop sliding */
  confirmMoveTo() {
    Animated.timing(this._animatedScale, {
      toValue: 1,
      duration: 100,
    }).start();
  }

  /** {@inheritDoc @types/react#Component.render} */
  render() {
    // noinspection JSSuspiciousNameCombination
    return (
      // the outer circle to draw the border
      <Animated.View
        style={[
          this.props.style,
          {
            width: this._containerDia,
            height: this._containerDia,
            backgroundColor: this.state.borderColor,
            borderRadius: this._containerRadii,
            position: 'absolute',
            left: this._animatedLeft,
            transform: [{ scale: this._animatedScale }],
          },
        ]}
        {...this._panResponder.panHandlers}
        hitSlop={{
          top: this.props.touchPadding,
          left: this.props.touchPadding,
          bottom: this.props.touchPadding,
          right: this.props.touchPadding,
        }}
      >
        {/*the inner circle*/}
        <View
          style={{
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

  // when thumb radii updated, re-calc the dimens
  private _onRadiiUpdate(props: ThumbProps) {
    this._radii = props.radius || 0;
    this._dia = this._radii * 2;
    this._containerRadii = this._radii + THUMB_BORDER_WIDTH;
    this._containerDia = this._containerRadii * 2;
  }

  // return a memoized function to handle sliding animation events
  private _getOnSliding(): Animated.ValueListenerCallback {
    let prevX = this.x; // memorize the previous x

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

  // from 'lowest' to 'non-lowest'
  private _onExplode() {
    this.setState({
      borderColor: this.props.enabledColor,
      color: this.props.enabledColor,
    });
  }

  // from 'non-lowest' to 'lowest'
  private _onCollapse() {
    this.setState({
      borderColor: this.props.disabledColor,
      color: LOWEST_VALUE_THUMB_COLOR,
    });
  }
}
