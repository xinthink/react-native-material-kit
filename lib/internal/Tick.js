//
// The `tick` used in `Checkbox`, for internal use only
//
// - [Props](#props)
//

const React = require('react-native');

const {
  Component,
  View,
  PropTypes,
  requireNativeComponent,
  Animated,
} = React;

const utils = require('../utils');


// ## <section id='props'>Props</section>
const PROP_TYPES = {
  // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

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
  render() {
    return (
      <NativeTick
        {...this.props}
        fillColor={utils.parseColor(this.props.fillColor)}
      />
    );
  }
}

Tick.propTypes = PROP_TYPES;


// ## Public interface
module.exports = Tick;
Tick.animated = Animated.createAnimatedComponent(Tick);
