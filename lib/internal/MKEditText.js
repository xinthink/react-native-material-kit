//
// Touchable view, for listening to touch events, but not intercept them.
//
// Created by ywu on 15/9/22.
//

import React, { Component } from 'react';

import ReactNative, {
  requireNativeComponent,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

import TextInputState from './TextInputState';


if (Platform.OS === 'android') {
  //
  // ## <section id='MKEditText'>MKEditText</section>
  //
  class MKEditText extends Component {
    constructor(props) {
      super(props);
      this._inputRef = null;
    }

    componentDidMount() {
      if (!this.context.focusEmitter) {
        if (this.props.autoFocus) {
          this.requestAnimationFrame(this.focus);
        }
        return;
      }
      this._focusSubscription = this.context.focusEmitter.addListener(
        'focus',
        (el) => {
          if (this === el) {
            this.requestAnimationFrame(this.focus);
          } else if (this.isFocused()) {
            this.blur();
          }
        }
      );
      if (this.props.autoFocus) {
        this.context.onFocusRequested(this);
      }
    }

    componentWillUnmount() {
      if (this._focusSubscription) {
        this._focusSubscription.remove();
      }

      if (this.isFocused()) {
        this.blur();
      }
    }

    setNativeProps(props) {
      return this._inputRef && this._inputRef.setNativeProps(props);
    }

    measure(cb) {
      return this._inputRef && this._inputRef.measure(cb);
    }

    isFocused() {
      return this._inputRef &&
        TextInputState.currentlyFocusedField() ===
          ReactNative.findNodeHandle(this._inputRef);
    }

    focus() {
      return this._inputRef && this._inputRef.focus();
    }

    blur() {
      return this._inputRef && this._inputRef.blur();
    }

    _setNativeRef = id => (this._inputRef = id);

    _onPress = () => {
      if (this.props.editable || this.props.editable === undefined) {
        this.focus();
      }
    };

    render() {
      return (
        <TouchableWithoutFeedback
          onPress={this._onPress}
        >
          <NativeEditText
            ref={this._setNativeRef}
            {...this.props}
          />
        </TouchableWithoutFeedback>
      );
    }
  }

  // ## <section id='props'>Props</section>
  // @see [RN.TextInput Props](https://facebook.github.io/react-native/docs/textinput.html#props)...
  MKEditText.propTypes = TextInput.propTypes;

  const NativeEditText = requireNativeComponent('MKEditText', null);
  // NativeEditText.propTypes = TextInput.propTypes;
  // NativeEditText.prototype.isFocused = () => UIManager.exy();
  // NativeEditText.prototype.isFocused = () => TextInputState.currentlyFocusedField() ===
      // ReactNative.findNodeHandle(this.id);

  // ## Public interface
  // module.exports = NativeEditText;
  module.exports = MKEditText;
} else {
  module.exports = TextInput;
}
