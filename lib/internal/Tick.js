/* eslint react/prefer-stateless-function:0 */
//
// The `tick` used in `Checkbox`, for internal use only
//
// - [Props](#props)
//

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from '../utils';

import {
  requireNativeComponent,
  Animated,
  processColor,
} from 'react-native';

// ## <section id='props'>Props</section>
const PROP_TYPES = {
  // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...ViewPropTypes,

  // Background color of the tick
  fillColor: PropTypes.any,

  // Insets of the tick
  inset: PropTypes.number,
};

const NativeTick = requireNativeComponent('TickView', {
  name: 'TickView',
  propTypes: PROP_TYPES,
});

//
// ## <section id='Tick'>Tick</section>
// The `Tick` used in `Checkbox` component.
//
class Tick extends Component {
  static propTypes = PROP_TYPES;

  render() {
    return (
      <NativeTick
        {...this.props}
        fillColor={processColor(this.props.fillColor)}
      />
    );
  }
}


// ## Public interface
module.exports = Tick;
Tick.animated = Animated.createAnimatedComponent(Tick);
