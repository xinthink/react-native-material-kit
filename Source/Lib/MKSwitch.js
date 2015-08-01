/**
 * Created by ywu on 15/7/25.
 */

const React = require('react-native');
const {
  Component,
  requireNativeComponent,
  TouchableWithoutFeedback,
} = React;


/**
 * icon toggle
 */
class MKSwitch extends Component {

  _onEvent(event) {
    // console.log('got event', event);
    const newState = event.nativeEvent;

    if (this.props.onCheckedChange) {
      this.props.onCheckedChange(newState);
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

MKSwitch.propTypes = {
  ...TouchableWithoutFeedback.propTypes,
  checked: React.PropTypes.bool,
  thumbRadius: React.PropTypes.number,
  onColor: React.PropTypes.string,
  offColor: React.PropTypes.string,
  thumbOnColor: React.PropTypes.string,
  thumbOffColor: React.PropTypes.string,
  rippleLayerColor: React.PropTypes.string,
  slidingAniDuration: React.PropTypes.number,
  onCheckedChange: React.PropTypes.func,
};

MKSwitch.defaultProps = {
  style: {
    width: 36, height: 14,
  },
};

const NativeSwitch = requireNativeComponent('MKSwitch', MKSwitch);


// --------------------------
// builders
//
const {
  Builder,
} = require('./builder');

/**
 * Switch builder
 */
class MKSwitchBuilder extends Builder {
  withChecked(v) {
    this.checked = v;
    return this;
  }

  withThumbRadius(v) {
    this.thumbRadius = v;
    return this;
  }

  withOnColor(v) {
    this.onColor = v;
    return this;
  }

  withOffColor(v) {
    this.offColor = v;
    return this;
  }

  withThumbOnColor(v) {
    this.thumbOnColor = v;
    return this;
  }

  withThumbOffColor(v) {
    this.thumbOffColor = v;
    return this;
  }

  withRippleLayerColor(v) {
    this.rippleLayerColor = v;
    return this;
  }

  withSlidingAniDuration(v) {
    this.slidingAniDuration = v;
    return this;
  }

  withOnCheckedChange(v) {
    this.onCheckedChange = v;
    return this;
  }

  build() {
    const props = this.toProps();
    //console.log(props);

    return React.createClass({
      render: function () {
        return <MKSwitch {...Object.assign({}, props, this.props)} />;
      },
    });
  }
}

/**
 * Built-in switch builders
 */
function mkSwitch() {
  return new MKSwitchBuilder();
}

module.exports = MKSwitch;
MKSwitch.Builder = MKSwitchBuilder;
MKSwitch.mkSwitch = mkSwitch;
