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
} = React;

const utils = require('../utils');


// ## <section id='props'>Props</section>
const PROP_TYPES = {
  // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Background color of the tick
  fillColor: PropTypes.string,

  // Insets of the tick
  inset: PropTypes.number,

  // FIXME `no propType for native prop` error on Android
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
  translateX: PropTypes.number,
  translateY: PropTypes.number,
  rotation: PropTypes.number,
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
