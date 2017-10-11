//
// MDL-style Checkbox component.
//
// - @see [MDL Checkbox](http://www.getmdl.io/components/index.html#toggles-section/checkbox)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/12/13.
//

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  Animated,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import MKColor from '../MKColor';
import Ripple from './Ripple';
import Tick from '../internal/Tick';
import * as utils from '../utils';
import { getTheme } from '../theme';

const DEFAULT_EXTRA_RIPPLE_RADII = 5;

//
// ## <section id='Checkbox'>Checkbox</section>
// The `Checkbox` component.
class Checkbox extends Component {

  // ## <section id='props'>Props</section>
  static propTypes = {
    // [Ripple Props](Ripple.html#props)...
    ...Ripple.propTypes,

    // [Tick Props](../internal/Tick.html#props)...
    ...Tick.propTypes,

    // Touchable...
    ...TouchableWithoutFeedback.propTypes,

    // Color of the border (outer circle), when checked
    borderOnColor: PropTypes.string,

    // Color of the border (outer circle), when unchecked
    borderOffColor: PropTypes.string,

    // Color of the inner circle, when checked
    fillColor: PropTypes.string,

    // Toggle status
    checked: PropTypes.bool,

    // Callback when the toggle status is changed
    onCheckedChange: PropTypes.func,

    // How far the ripple can extend outside the Checkbox's border,
    // default is 5
    extraRippleRadius: PropTypes.number,

    // Toggle Editable
    editable: PropTypes.bool,
  };

  // ## <section id='defaults'>Defaults</section>
  static defaultProps = {
    pointerEvents: 'box-only',
    maskColor: MKColor.Transparent,
    editable: true,
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 20,
      height: 20,
      borderWidth: 2,
      borderRadius: 1,
    },
  };

  constructor(props) {
    super(props);
    this.theme = getTheme();
    this._animatedTickAlpha = new Animated.Value(0);
    this.state = {
      checked: false,
      width: 0,
      height: 0,
      rippleRadii: 0,
    };
  }

  componentWillMount() {
    this._initView(this.props.checked);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this._initView(nextProps.checked);
    }
  }

  // property initializers begin
  _onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (width === this.state.width && height === this.state.height) {
      return;
    }

    const size = Math.min(width, height);
    const rippleRadii = size * Math.SQRT2 / 2 + (this.props.extraRippleRadius ||
      DEFAULT_EXTRA_RIPPLE_RADII);
    this.setState({
      rippleRadii,
      width: rippleRadii * 2,
      height: rippleRadii * 2,
    });
  };

  // Touch events handling
  _onTouch = (evt) => {
    if (evt.type === 'TOUCH_UP' && this.props.editable) {
      this.confirmToggle();
    }
  };
  // property initializers end

  _initView(checked) {
    this.setState({ checked });
    this._aniToggle(checked);
  }

  // When a toggle action (from the given state) is confirmed.
  confirmToggle() {
    const prevState = this.state.checked;
    const newState = !prevState;

    this.setState({ checked: newState }, () => {
      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({ checked: this.state.checked });
      }
    });

    this._aniToggle(newState);
  }

  // animate the checked state, by scaling the inner circle
  _aniToggle(checked) {
    Animated.timing(this._animatedTickAlpha, {
      toValue: checked ? 1 : 0,
      duration: 220,
    }).start();
  }

  render() {
    const defaultStyle = this.theme.checkboxStyle;
    const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, [
      'borderOnColor',
      'borderOffColor',
      'fillColor',
      'rippleColor',
      'inset',
    ]));
    const borderColor = this.state.checked ? mergedStyle.borderOnColor : mergedStyle.borderOffColor;

    return (
      <TouchableWithoutFeedback {...utils.extractTouchableProps(this)} >
        <Ripple
          {...this.props}
          maskBorderRadiusInPercent={50}
          rippleLocation="center"
          rippleColor={mergedStyle.rippleColor}
          onTouch={this._onTouch}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: this.state.width,
            height: this.state.height,
          }}
        >
          <View ref="container"
            style={[
              Checkbox.defaultProps.style,
              this.props.style, {
                borderColor,
                alignItems: 'stretch',
              },
            ]}
            onLayout={this._onLayout}
          >
            <Tick.animated ref="tick"
              inset={mergedStyle.inset}
              fillColor={mergedStyle.fillColor}
              style={{
                flex: 1,
                opacity: this._animatedTickAlpha,
              }}
            />
          </View>
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }
}


// ## Public interface
module.exports = Checkbox;
