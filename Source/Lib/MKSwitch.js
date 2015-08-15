//
// MDL-style Switch component.
//
// - @see [MDL Switch](http://bit.ly/1IcHMPo)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/7/25.
//

const React = require('react-native');
const {
  Component,
  requireNativeComponent,
  TouchableWithoutFeedback,
} = React;

const {getTheme} = require('./theme');
const utils = require('./utils');


//
// ## <section id='MKSwitch'>MKSwitch</section>
// The `Switch` component. Which is made up of a `Track` and a [`Thumb`](#thumb).
//
class MKSwitch extends Component {

  _onEvent(event) {
    if (this.props.onCheckedChange) {
      this.props.onCheckedChange(event.nativeEvent);
    }
  }

  render() {
    const touchableProps = {};
    if (!this.props.disabled) {
      Object.assign(touchableProps, {
        onPress: this.props.onPress,
        onPressIn: this.props.onPressIn,
        onPressOut: this.props.onPressOut,
        onLongPress: this.props.onLongPress,
      });
    }

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <NativeSwitch
          {...this.props}
          style={[MKSwitch.defaultProps.style, this.props.style]}
          onChange={this._onEvent.bind(this)}
        />
      </TouchableWithoutFeedback>
    );
  }
}

// ## <section id='props'>Props</section>
MKSwitch.propTypes = {
  // Touchable...
  ...TouchableWithoutFeedback.propTypes,

  // Toggle status of the `Switch`
  checked: React.PropTypes.bool,

  // Color of the track, when switch is checked
  onColor: React.PropTypes.string,

  // Color of the track, when switch is off
  offColor: React.PropTypes.string,

  // Radius of the thumb button
  thumbRadius: React.PropTypes.number,

  // Color of the thumb, when switch is checked
  thumbOnColor: React.PropTypes.string,

  // Color of the thumb, when switch is off
  thumbOffColor: React.PropTypes.string,

  // Duration of the thumb sliding animation, in milliseconds
  slidingAniDuration: React.PropTypes.number,

  // Color of the ripple layer
  rippleColor: React.PropTypes.string,

  // Color of the ripple layer, alias of `rippleColor`
  rippleLayerColor: React.PropTypes.string,

  // Callback when the toggle status is changed.
  onCheckedChange: React.PropTypes.func,
};

// ## <section id='defaults'>Defaults</section>
MKSwitch.defaultProps = {
  thumbRadius: utils.toPixels(7),
  style: {
    width: utils.toPixels(24), height: utils.toPixels(10),
  },
};

const NativeSwitch = requireNativeComponent('MKSwitch', MKSwitch);


// --------------------------
// Builder
//
const {
  Builder,
} = require('./builder');

//
// ## Switch builder
//
class MKSwitchBuilder extends Builder {

  build() {
    const props = this.toProps();

    return React.createClass({
      render: function () {
        return <MKSwitch {...Object.assign({}, props, this.props)} />;
      },
    });
  }
}

// define builder method for each prop
MKSwitchBuilder.defineProps(MKSwitch.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//
function mkSwitch() {
  const theme = getTheme().toggleTheme;
  return new MKSwitchBuilder()
    .withOnColor(theme.onColor)
    .withOffColor(theme.offColor)
    .withThumbOnColor(theme.thumbOnColor)
    .withThumbOffColor(theme.thumbOffColor)
    .withRippleColor(theme.rippleColor);
}

// ## Public interface
module.exports = MKSwitch;
MKSwitch.Builder = MKSwitchBuilder;
MKSwitch.mkSwitch = mkSwitch;
