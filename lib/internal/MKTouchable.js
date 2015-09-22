//
// Touchable view, for listening to touch events, but not intercept them.
//
// Created by ywu on 15/9/22.
//

const React = require('react-native');
const {
  Component,
  requireNativeComponent,
} = React;

//
// ## <section id='MKTouchable'>MKTouchable</section>
//
class MKTouchable extends Component {

  _onTouchEvent(event) {
    if (this.props.onTouchEvent) {
      this.props.onTouchEvent(event.nativeEvent);
    }
  }

  measure(cb) {
    return this.refs.node.measure(cb);
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
      <NativeTouchable
        ref="node"
        {...this.props}
        style={this.props.style}
        onChange={this._onTouchEvent.bind(this)}
        >
        {this.props.children}
      </NativeTouchable>
    );
  }
}

// ## <section id='props'>Props</section>
MKTouchable.propTypes = {
  // Touch events callback
  onTouchEvent: React.PropTypes.func,
};

const NativeTouchable = requireNativeComponent('MKTouchable', MKTouchable);


// ## Public interface
module.exports = MKTouchable;
