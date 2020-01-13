/* eslint react/prefer-stateless-function:0 */
/**
 * The `Tick` part used in `Checkbox`, for internal use only
 */
import React, { Component } from 'react';
import { Animated, processColor, requireNativeComponent, ViewProps } from 'react-native';

// ## <section id='props'>Props</section>
export interface TickProps extends ViewProps {
  /** Background color of the tick */
  fillColor?: string;

  /** Insets of the tick */
  inset?: number;
}

// @ts-ignore ComponentInterface requires `propTypes`
const NativeTick = requireNativeComponent('TickView', Tick);

/**
 * Wrap the native `Tick` component, which is used in {@link Checkbox}.
 *
 * Note: `createAnimatedComponent` does not support SFC
 */
export default class Tick extends Component<TickProps> {
  render = () => <NativeTick {...this.props} fillColor={processColor(this.props.fillColor)} />;
}

export const AnimatedTick = Animated.createAnimatedComponent(Tick);
