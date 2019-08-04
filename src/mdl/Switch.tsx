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

import React, { Component, createRef } from 'react';

import {
  Animated,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';

import { getTheme, Theme } from '../theme';
import { CheckedListener } from '../types';
import * as utils from '../utils';
import AnimatedThumb, { Thumb } from './SwitchThumb';

const defaultThumbRadius = 14;
const defaultTrackLength = 48;
const defaultTrackSize = 20;

// ## <section id='props'>Props</section>
export type SwitchProps = {
  // Toggle status of the `Switch`
  checked?: boolean;

  // Callback when the toggle status is changed.
  onCheckedChange?: CheckedListener;

  // Color of the track, when switch is checked
  onColor?: string;

  // Color of the track, when switch is off
  offColor?: string;

  // The thickness of the Switch track
  trackSize?: number;

  // The length of the Switch track
  trackLength?: number;

  // Radius of the thumb button
  thumbRadius?: number;

  // Color of the thumb, when switch is checked
  thumbOnColor?: string;

  // Color of the thumb, when switch is off
  thumbOffColor?: string;

  // Duration of the thumb sliding animation, in milliseconds
  thumbAniDuration?: number;

  // Color of the ripple layer
  rippleColor?: string;

  // Duration of the ripple effect, in milliseconds
  rippleAniDuration?: number;
} & TouchableWithoutFeedbackProps;

interface SwitchState {
  checked: boolean;
  thumbFrame: {
    padding: number;
    r: number;
    rippleRadii: number;
    x: number;
  };
  trackLength: number;
  trackMargin: number;
  trackRadii: number;
  trackSize: number;
}

// ## <section id='switch'>Switch</section>
// The `Switch` component. Which is made up of a `Track` and a [`Thumb`](#thumb).
export default class Switch extends Component<SwitchProps, SwitchState> {
  // ## <section id='defaults'>Defaults</section>
  static defaultProps: SwitchProps = {
    checked: false,
    thumbRadius: defaultThumbRadius,
    trackLength: defaultTrackLength,
    trackSize: defaultTrackSize,
  };

  private theme = getTheme();
  private thumbRef = createRef<Component>();
  private animatedThumbLeft = new Animated.Value(0);

  constructor(props: SwitchProps) {
    super(props);
    this.state = {
      checked: false,
      thumbFrame: {
        padding: 0,
        r: 0,
        rippleRadii: 0,
        x: 0,
      },
      trackLength: 0,
      trackMargin: 0,
      trackRadii: 0,
      trackSize: 0,
    };
  }

  UNSAFE_componentWillMount() {
    // console.log('--- Switch.componentWillReceiveProps');
    this.initLayout(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: SwitchProps) {
    // console.log('--- Switch.componentWillReceiveProps');
    if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
      this.initLayout(nextProps);
    }
  }

  // Rendering the `Switch`
  render() {
    const touchProps = {
      delayLongPress: this.props.delayLongPress,
      delayPressIn: this.props.delayPressIn,
      delayPressOut: this.props.delayPressOut,
      onLongPress: this.props.onLongPress,
    };

    const mergedStyle = Object.assign({}, this.theme.switchStyle, utils.compact( {
      offColor: this.props.offColor,
      onColor: this.props.onColor,
      rippleColor: this.props.rippleColor,
      thumbOffColor: this.props.thumbOffColor,
      thumbOnColor: this.props.thumbOnColor,
    }));

    const thumbFrame = this.state.thumbFrame;
    const thumbProps = {
      checked: this.state.checked,
      offColor: mergedStyle.thumbOffColor,
      onColor: mergedStyle.thumbOnColor,
      radius: this.props.thumbRadius,
      rippleAniDuration: this.props.rippleAniDuration,
      rippleColor: mergedStyle.rippleColor,
      rippleRadius: thumbFrame.rippleRadii,
      style: {
        left: this.animatedThumbLeft,
        top: 0,
      },
      thumbStyle: {
        borderRadius: this.props.thumbRadius,
        left: thumbFrame.padding,
        top: thumbFrame.padding,

        height: (this.props.thumbRadius || defaultThumbRadius) * 2,
        width: (this.props.thumbRadius || defaultThumbRadius) * 2,
      },
    };

    return (
      <TouchableWithoutFeedback
        {...touchProps}
        onPress={this.onPress}
        onPressIn={this.onPressIn}
        onPressOut={this.onPressOut}
      >
        <View
          pointerEvents="box-only"
          style={this.props.style}
        >
          <View // the 'track' part
            style={{
              backgroundColor: this.getBgColor(mergedStyle),
              borderRadius: this.state.trackRadii,
              height: this.props.trackSize,
              margin: this.state.trackMargin,
              width: this.props.trackLength,
            }}
          />
          <AnimatedThumb // the 'thumb' part
            ref={this.thumbRef}
            {...thumbProps}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // Un-boxing the `Thumb` node from `AnimatedComponent`,
  // in order to access the component functions defined in `Thumb`
  private get thumb(): Thumb | null {
    const animatedThumb = this.thumbRef.current as any;
    return animatedThumb && animatedThumb.getNode() as Thumb;
  }

  private getBgColor(theme: Theme): string {
    const onColor = this.props.onColor || theme.onColor as string;
    const offColor = this.props.offColor || theme.offColor as string;
    return this.state.checked ? onColor : offColor;
  }

  private onPress = (event: GestureResponderEvent) => {
    this.confirmToggle();
    this.props.onPress && this.props.onPress(event);
  };

  private onPressIn = (event: GestureResponderEvent) => {
    this.startToggle();
    this.props.onPressIn && this.props.onPressIn(event);
  };

  private onPressOut = (event: GestureResponderEvent) => {
    this.endToggle();
    this.props.onPressOut && this.props.onPressOut(event);
  };

  // Layout the thumb according to the size of the track
  private layoutThumb(checked: boolean | undefined,
                      thumbRadius: number | undefined,
                      trackLength: number | undefined,
                      trackSize: number | undefined
  ): any {
    trackSize = trackSize || defaultTrackSize;
    trackLength = trackLength || defaultTrackLength;
    const thumbRadii = thumbRadius || defaultThumbRadius;
    const rippleRadii = trackLength - trackSize;
    const trackRadii = trackSize / 2;
    const trackMargin = rippleRadii - trackRadii; // make room for ripple
    const thumbLeft = checked ? trackMargin + trackRadii : 0;
    this.animatedThumbLeft.setValue(thumbLeft);

    return {
      thumbFrame: {
        padding: rippleRadii - thumbRadii,
        r: thumbRadii,
        rippleRadii,
        x: thumbLeft,
      },
      trackLength,
      trackMargin,
      trackRadii,
      trackSize,
    };
  }

  // init layout according to the props
  private initLayout(props: SwitchProps) {
    const nextState = this.layoutThumb(
      props.checked || false,
      props.thumbRadius,
      props.trackLength,
      props.trackSize,
    );
    this.setState({
      ...nextState,
      checked: props.checked || false,
    });
  }

  // Move the thumb left or right according to the current state
  private translateThumb() {
    this.animatedThumbLeft.setValue(this.state.thumbFrame.x);
    const newX = this.computeThumbX(this.state.checked);
    Animated.timing(this.animatedThumbLeft, {
      duration: this.props.thumbAniDuration || 300,
      toValue: newX,
    }).start(() => {
      this.state.thumbFrame.x = newX;
    });
  }

  // Calc the next position (x-axis) of the thumb
  private computeThumbX(toChecked: boolean) {
    if (!this.state.thumbFrame.r) {
      return 0;
    }

    const { trackLength, trackSize } = this.state;
    const dx = (toChecked ? 1 : -1) * (trackLength - trackSize);
    return this.state.thumbFrame.x + dx;
  }

  // When a toggle action started.
  private startToggle() {
    this.thumb && this.thumb.startToggle();
  }

  // When a toggle action is confirmed.
  private confirmToggle() {
    const prevState = this.state.checked;
    this.setState({checked: !prevState}, () => {
      this.thumb && this.thumb.confirmToggle(prevState);
      this.translateThumb();

      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({checked: this.state.checked});
      }
    });
  }

  // When a toggle action is finished (confirmed or canceled).
  private endToggle() {
    this.thumb && this.thumb.endToggle();
  }
}
