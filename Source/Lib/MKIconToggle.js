/**
 * Created by ywu on 15/7/25.
 */

const React = require('react-native');
const {
  Component,
  requireNativeComponent,
  TouchableWithoutFeedback,
} = React;

const MKPropTypes = require('./MKPropTypes');
const MKColor = require('./MKColor');


function isViewForState(view, state) {
  return (view.props.state_checked && state) ||
    !(view.props.state_checked || state);
}

/**
 * icon toggle
 */
class MKIconToggle extends Component {
  constructor() {
    super();
    this.state = {};
  }

  _onEvent(event) {
    // console.log('got event', event);
    const newState = event.nativeEvent;
    this.setState({ checked: newState.checked });

    if (this.props.onCheckedChange) {
      this.props.onCheckedChange(newState);
    }
  }

  _renderChildren() {
    //console.log('rendering children', this.props.checked);
    return React.Children.map(this.props.children,
      (child) => isViewForState(child, this.state.checked) ? child : null);
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
        <NativeIconToggle {...this.props}
          style={[MKIconToggle.defaultProps.style, this.props.style]}
          onChange={this._onEvent.bind(this)}
          >
          {this._renderChildren()}
        </NativeIconToggle>
      </TouchableWithoutFeedback>
    );
  }
}

MKIconToggle.defaultProps = {
  style: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,.54)',
    width: 36, height: 36,
  },
};

MKIconToggle.propTypes = {
  ...TouchableWithoutFeedback.propTypes,
  checked: React.PropTypes.bool,
  insets: MKPropTypes.insets,
  onCheckedChange: React.PropTypes.func,
};

const NativeIconToggle = requireNativeComponent('MKIconToggle', MKIconToggle);


// --------------------------
// builders
//
const {
  Builder,
} = require('./builder');

/**
 * Toggle builder
 */
class MKIconToggleBuilder extends Builder {
  withChecked(v) {
    this.checked = v;
    return this;
  }

  withInsets(v) {
    this.insets = v;
    return this;
  }

  withOnCheckedChange(v) {
    this.onCheckedChange = v;
    return this;
  }

  build() {
    const props = this.toProps();
    // console.log(props);

    return React.createClass({
      render: function () {
        return (
          <MKIconToggle {...Object.assign({}, props, this.props)}>
            {this.props.children}
          </MKIconToggle>
        );
      },
    });
  }
}

/**
 * Built-in toggle builders
 */
function toggle() {
  return new MKIconToggleBuilder().withBackgroundColor(MKColor.Transparent);
}


module.exports = MKIconToggle;
MKIconToggle.Builder = MKIconToggleBuilder;
MKIconToggle.toggle = toggle;
