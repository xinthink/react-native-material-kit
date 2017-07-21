//
// MDL-style Icon Toggle component.
//
// - @see [MDL Icon Toggle](http://bit.ly/1OUYzem)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/10/07.
//

import React, {
  Children,
  Component,
} from 'react';
import PropTypes from 'prop-types';

import {
  TouchableWithoutFeedback,
} from 'react-native';

import MKColor from '../MKColor';
import Ripple from './Ripple';
import * as utils from '../utils';
import { getTheme } from '../theme';

function isViewForState(view, state) {
  return (view.props.state_checked && state) ||
    !(view.props.state_checked || state);
}

//
// ## <section id='IconToggle'>IconToggle</section>
// The `IconToggle` component.
class IconToggle extends Component {
  // ## <section id='props'>Props</section>
  static propTypes = {
    // [Ripple Props](Ripple.html#props)...
    ...Ripple.propTypes,

    // Touchable...
    ...TouchableWithoutFeedback.propTypes,

    // Toggle status
    checked: PropTypes.bool,

    // Callback when the toggle status is changed
    onCheckedChange: PropTypes.func,

    children: PropTypes.node,
  };

  // ## <section id='defaults'>Defaults</section>
  static defaultProps = {
    pointerEvents: 'box-only',
    enabled: true,
    maskColor: MKColor.Transparent,
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'rgba(0,0,0,.54)',
      width: 56,
      height: 56,
    },
  };

  constructor(props) {
    super(props);
    this.theme = getTheme();
    this.state = { checked: false };
  }

  componentWillMount() {
    this.setState({ checked: this.props.checked });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({ checked: nextProps.checked });
    }
  }

  // property initializers begin
  // Touch events handling
  _onTouch = (evt) => {
    if (evt.type === 'TOUCH_UP') {
      this.confirmToggle();
    }
  };
  // property initializers end

  // When a toggle action (from the given state) is confirmed.
  confirmToggle() {
    const prevState = this.state.checked;
    this.setState({ checked: !prevState }, () => {
      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({ checked: this.state.checked });
      }
    });
  }

  // Select a child element to show for the current toggle status.
  //
  // @see [State List](http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList) in Android development
  _renderChildren() {
    return Children.map(this.props.children,
      (child) => isViewForState(child, this.state.checked) && child
    );
  }

  render() {
    const mergedStyle = Object.assign({}, this.theme.iconToggleStyle, utils.compact({
      rippleColor: this.props.rippleColor,
    }));

    return (
      <TouchableWithoutFeedback {...utils.extractTouchableProps(this)}>
        <Ripple
          {...this.props}
          rippleColor={mergedStyle.rippleColor}
          style={[IconToggle.defaultProps.style, this.props.style]}
          maskBorderRadiusInPercent={50}
          rippleLocation="center"
          onTouch={this._onTouch}
        >
          {this._renderChildren()}
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }
}


// ## Public interface
module.exports = IconToggle;
