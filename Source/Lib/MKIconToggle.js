//
// MDL-style Icon Toggle component.
//
// - @see [MDL Icon Toggle](http://bit.ly/1OUYzem)
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

const MKPropTypes = require('./MKPropTypes');
const MKColor = require('./MKColor');
const utils = require('./utils');


function isViewForState(view, state) {
  return (view.props.state_checked && state) ||
    !(view.props.state_checked || state);
}

//
// ## <section id='MKIconToggle'>MKIconToggle</section>
//
class MKIconToggle extends Component {
  constructor() {
    super();
    this.state = {};
  }

  _onEvent(event) {
    const newState = event.nativeEvent;
    this.setState({ checked: newState.checked });

    if (this.props.onCheckedChange) {
      this.props.onCheckedChange(newState);
    }
  }

  // Select a child element to show for the current toggle status.
  //
  // @see [State List](http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList) in Android development
  _renderChildren() {
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

// ## <section id='defaults'>Defaults</section>
MKIconToggle.defaultProps = {
  insets: {
    top: utils.toPixels(5),
    left: utils.toPixels(5),
    right: utils.toPixels(5),
    bottom: utils.toPixels(5),
  },
  style: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,.54)',
    width: utils.toPixels(24),
    height: utils.toPixels(24),
  },
};

// ## <section id='props'>Props</section>
MKIconToggle.propTypes = {
  // Touchable...
  ...TouchableWithoutFeedback.propTypes,

  // Toggle status
  checked: React.PropTypes.bool,

  // Space around the visible part, to expand the touchable area
  insets: MKPropTypes.insets,

  // Callback when the toggle status is changed
  onCheckedChange: React.PropTypes.func,
};

const NativeIconToggle = requireNativeComponent('MKIconToggle', MKIconToggle);


// --------------------------
// Builder
//
const {
  Builder,
} = require('./builder');

//
// ## Toggle builder
//
class MKIconToggleBuilder extends Builder {
  build() {
    const props = this.toProps();

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

// define builder method for each prop
MKIconToggleBuilder.defineProps(MKIconToggle.propTypes);


// ----------
// ## <secion id="builders">Built-in builders</secton>
//
function toggle() {
  return new MKIconToggleBuilder().withBackgroundColor(MKColor.Transparent);
}


// ## Public interface
module.exports = MKIconToggle;
MKIconToggle.Builder = MKIconToggleBuilder;
MKIconToggle.toggle = toggle;
