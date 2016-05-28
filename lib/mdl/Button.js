//
// MDL-style Button component.
//
// - @see [MDL Button](http://www.getmdl.io/components/index.html#buttons-section)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/7/2.
//

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import MKColor from '../MKColor';
import Ripple from './Ripple';
import * as utils from '../utils';
import { getTheme } from '../theme';

//
// ## <section id='Button'>Button</section>
// The `Button` component. With configurable shadow, ripple effect, and FAB style.
//
class Button extends Component {
  constructor(props) {
    super(props);
    this.theme = getTheme();
    this.state = {
      width: 0,
      height: 0,
    };
  }

  _onLayout({ nativeEvent: { layout: { width, height } } }) {
    if (width !== this.state.width || height !== this.state.height) {
      this.setState({
        width,
        height,
      });
    }
  }

  _renderChildren() {
    return this.props.children;
  }

  render() {
    const touchableProps = {};
    if (this.props.enabled) {
      Object.assign(touchableProps, utils.extractTouchableProps(this));
    }

    // fix #57 applying `onLayout` to <Ripple>, <TouchableXXX> clones `onLayout` to it's child
    touchableProps.onLayout = this._onLayout.bind(this);

    const fabStyle = {};
    const maskProps = {};

    if (this.props.fab) {
      maskProps.maskBorderRadiusInPercent = 50;

      if (this.state.width > 0 || this.state.height > 0) {
        let size = Math.min(this.state.width, this.state.height);
        if (!size || size <= 0) {
          size = Math.max(this.state.width, this.state.height);
        }

        fabStyle.width = size;
        fabStyle.height = size;
        fabStyle.borderRadius = size / 2;
      }
    }

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <Ripple ref="container"
          {...this.props}
          {...maskProps}
          style={[
            this.props.style,
            fabStyle,
          ]}
        >
          {this._renderChildren()}
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }
}

// ## <section id='props'>Props</section>
Button.propTypes = {
  // [Ripple Props](Ripple.html#props)...
  ...Ripple.propTypes,

  // [RN.TouchableWithoutFeedback Props](https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html#props)...
  ...TouchableWithoutFeedback.propTypes,

  // Whether this's a FAB
  fab: PropTypes.bool,

  // Whether the button is enabled
  enabled: PropTypes.bool,
};

// ## <section id='defaults'>Defaults</section>
Button.defaultProps = {
  // [Ripple defaults](Ripple.html#defaults)...
  ...Ripple.defaultProps,
  pointerEvents: 'box-only',
  enabled: true,
};


// --------------------------
// Builder
//
const { TextViewBuilder } = require('../builder');

//
// ## Button builder
// - @see [TextViewBuilder](../builder.html#TextViewBuilder)
//
class ButtonBuilder extends TextViewBuilder {
  mergeStyle() {
    this.choseBackgroundColor();
    if (this.fab) {
      this.styleFab();
    }
    super.mergeStyle();
  }

  // merge default FAB style with custom setting
  styleFab() {
    this.mergeStyleWith({
      width: 48,
      height: 48,
      borderRadius: 24,
    });
  }

  build() {
    const theBuilder = this;
    const props = this.toProps();

    const BuiltButton = class extends Button {
      _renderChildren() {
        // use a text or a custom content
        return theBuilder.text ? (
          <Text style={theBuilder.textStyle || {}}>
            {theBuilder.text}
          </Text>
        ) : this.props.children;
      }
    };
    BuiltButton.defaultProps = Object.assign({}, Button.defaultProps, props);
    return BuiltButton;
  }
}

// define builder method for each prop
ButtonBuilder.defineProps(Button.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//

// Colored raised button
// FIXME shadow not work on Android
// @see https://facebook.github.io/react-native/docs/known-issues.html#no-support-for-shadows-on-android
function coloredRaisedButton() {
  return new ButtonBuilder()
    .withStyle({
      borderRadius: 2,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: 0.7,
      shadowColor: 'black',
      elevation: 4,
    })
    .withTextStyle({
      color: 'white',
      fontWeight: 'bold',
    });
}


// Accent colored raised button
function accentColoredRaisedButton() {
  return coloredRaisedButton().withAccent(true);
}

// Plain raised button
function plainRaisedButton() {
  // FIXME doesn't support translucent bg, has shadow problems
  return coloredRaisedButton()
    // .withBackgroundColor(getTheme().bgPlain)
    .withBackgroundColor(MKColor.Silver)
    .withMaskColor(getTheme().bgPlain)
    .withRippleColor(getTheme().bgPlain)
    // .withStyle({
    //   shadowOffset: {width: 0.3, height: 0},
    // })
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
}

// Plain flat button
function flatButton() {
  return new ButtonBuilder()
    .withBackgroundColor(MKColor.Transparent)
    .withMaskColor(getTheme().bgPlain)
    .withRippleColor(getTheme().bgPlain)
    .withShadowAniEnabled(false)
    .withStyle({
      borderRadius: 2,
    })
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
}

// Colored flat button
function coloredFlatButton() {
  return flatButton()
    .withRippleColor('rgba(255,255,255,0.2)')
    .withTextStyle({
      color: getTheme().primaryColor,
      fontWeight: 'bold',
    });
}

// Accent colored flat button
function accentColoredFlatButton() {
  return flatButton()
    .withRippleColor('rgba(255,255,255,0.2)')
    .withTextStyle({
      color: getTheme().accentColor,
      fontWeight: 'bold',
    });
}

// Colored FAB
function coloredFab() {
  return new ButtonBuilder()
    .withStyle({
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: 0.4,
      shadowColor: 'black',
      elevation: 4,
    })
    .withFab(true)
    .withRippleLocation('center');
}

// Accent colored FAB
function accentColoredFab() {
  return coloredFab().withAccent(true);
}

// Plain FAB
function plainFab() {
  // FIXME doesn't support translucent bg, has shadow problems
  return coloredFab()
    .withMaskColor(getTheme().bgPlain)
    .withRippleColor(getTheme().bgPlain)
    .withBackgroundColor(MKColor.Silver);
}


// ## Public interface
module.exports = Button;

Button.Builder = ButtonBuilder;
Button.button = plainRaisedButton;
Button.coloredButton = coloredRaisedButton;
Button.accentColoredButton = accentColoredRaisedButton;
Button.flatButton = flatButton;
Button.coloredFlatButton = coloredFlatButton;
Button.accentColoredFlatButton = accentColoredFlatButton;
Button.plainFab = plainFab;
Button.coloredFab = coloredFab;
Button.accentColoredFab = accentColoredFab;
