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
    if (this.props.onTouchEvent) {
      const evt = event.nativeEvent;
      evt.x = convertCoordinate(evt.x);
      evt.y = convertCoordinate(evt.y);
      this.props.onTouchEvent(evt);
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
  onTouchEvent: React.PropTypes.func,

  // FIXME A dummy prop having RN register this component
  // https://github.com/facebook/react-native/issues/2856#issuecomment-141997152
  dummy: PropTypes.string,

  // FIXME no propType for native prop error on Android
  nativeBackgroundAndroid: PropTypes.object,
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
  translateX: PropTypes.number,
  translateY: PropTypes.number,
  rotation: PropTypes.number,
};

const NativeTouchable = requireNativeComponent('MKTouchable', {
  name: 'MKTouchable',
  propTypes: MKTouchable.propTypes,
});

// ## Public interface
module.exports = MKTouchable;
