//
// Touchable view, for listening to touch events, but not intercept them.
//
// Created by ywu on 15/9/22.
//

const React = require('react-native');
const {convertCoordinate} = require('../utils');

const {
  Component,
  requireNativeComponent,
  View,
  PropTypes,
} = React;

//
// ## <section id='MKTouchable'>MKTouchable</section>
//
class MKTouchable extends Component {

  _onTouchEvent(event) {
    if (this.props.onTouch) {
      const evt = event.nativeEvent;
      evt.x = convertCoordinate(evt.x);
      evt.y = convertCoordinate(evt.y);
      this.props.onTouch(evt);
    }
  }

  measure(cb) {
    return this.refs.node.measure(cb);
  }

  render() {
    return (
      <NativeTouchable
        ref="node"
        {...this.props}
        style={this.props.style}
        onChange={this._onTouchEvent.bind(this)}
        onLayout={(evt) => this.props.onLayout && this.props.onLayout(evt)}
        >
        {this.props.children}
      </NativeTouchable>
    );
  }
}

// ## <section id='props'>Props</section>
MKTouchable.propTypes = {
  // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Touch events callback
  onTouch: React.PropTypes.func,

  // FIXME `no propType for native prop` error on Android
  nativeBackgroundAndroid: PropTypes.object,
};

const NativeTouchable = requireNativeComponent('MKTouchable', {
  name: 'MKTouchable',
  propTypes: MKTouchable.propTypes,
});

// ## Public interface
module.exports = MKTouchable;
