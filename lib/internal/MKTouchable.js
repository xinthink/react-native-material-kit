//
// Touchable view, for listening to touch events, but not intercept them.
//
// Created by ywu on 15/9/22.
//

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  requireNativeComponent,
  NativeModules,
  findNodeHandle,
  View
} from 'react-native';
const UIManager = NativeModules.UIManager;

import { convertCoordinate, ViewPropTypes } from '../utils';

//
// ## <section id='MKTouchable'>MKTouchable</section>
//
class MKTouchable extends Component {

  // region property initializers
  _onTouchEvent = (event) => {
    if (this.props.onTouch) {
      const evt = event.nativeEvent;
      evt.x = convertCoordinate(evt.x);
      evt.y = convertCoordinate(evt.y);
      this.props.onTouch(evt);
    }
  };
  // endregion

  measure(cb) {
    return this.refs.node && UIManager.measure(findNodeHandle(this.refs.node), cb);
  }

  render() {
    return (
      <NativeTouchable
        ref="node"
        {...this.props}
        style={this.props.style}
        onChange={this._onTouchEvent}
        onLayout={this.props.onLayout}
      >
        {this.props.children}
      </NativeTouchable>
    );
  }
}

// ## <section id='props'>Props</section>
MKTouchable.propTypes = {
  // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...(ViewPropTypes || View.propTypes),

  // Touch events callback
  onTouch: PropTypes.func,
};

const NativeTouchable = requireNativeComponent('MKTouchable', {
  name: 'MKTouchable',
  propTypes: MKTouchable.propTypes,
}, {
  nativeOnly: {
    nativeBackgroundAndroid: true,
    nativeForegroundAndroid: true,
  },
});

// ## Public interface
module.exports = MKTouchable;
