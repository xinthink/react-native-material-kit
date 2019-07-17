/* eslint react/prefer-stateless-function:0 */
//
// The `tick` used in `Checkbox`, for internal use only
//
// - [Props](#props)
//

import React, {Component} from 'react'
import {
  Animated,
  processColor,
  requireNativeComponent,
  ViewProps,
} from 'react-native';


// ## <section id='props'>Props</section>
export interface TickProps extends ViewProps {
  // Background color of the tick
  fillColor?: string

  // Insets of the tick
  inset?: number
};

// @ts-ignore ComponentInterface requires `propTypes`
const NativeTick = requireNativeComponent('TickView', Tick);

//
// ## <section id='Tick'>Tick</section>
// The `Tick` used in `Checkbox` component.
//
// Note: `createAnimatedComponent` does not support SFC
//
export default class Tick extends Component<TickProps> {
  render = () =>
    <NativeTick
      {...this.props}
      fillColor={processColor(this.props.fillColor)}
    />;
}

export const AnimatedTick = Animated.createAnimatedComponent(Tick);
