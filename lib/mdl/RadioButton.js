//
// MDL-style Radio button component.
//
// - @see [MDL Radio Button](http://www.getmdl.io/components/index.html#toggles-section/radio)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/10/12.
//

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  Animated,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import MKColor from '../MKColor';
import Ripple from './Ripple';
import * as utils from '../utils';
import { getTheme } from '../theme';

const DEFAULT_EXTRA_RIPPLE_RADII = 16;

//
// ## <section id='RadioButton'>RadioButton</section>
// The `RadioButton` component.
class RadioButton extends Component {
  // ## <section id='props'>Props</section>
  static propTypes = {
    // [Ripple Props](Ripple.html#props)...
    ...Ripple.propTypes,

    // Touchable...
    ...TouchableWithoutFeedback.propTypes,

    // Color of the border (outer circle), when checked
    borderOnColor: PropTypes.string,

    // Color of the border (outer circle), when unchecked
    borderOffColor: PropTypes.string,

    // Color of the inner circle, when checked
    fillColor: PropTypes.string,

    // Color of the border (outer circle), when checked and disabled
    disabledBorderOnColor: PropTypes.string,

    // Color of the border (outer circle), when unchecked and disabled
    disabledBorderOffColor: PropTypes.string,

    // Color of the inner circle, when checked and disabled
    disabledFillColor: PropTypes.string,

    // Toggle status
    checked: PropTypes.bool,

    // Group to which the Radio button belongs
    group: PropTypes.object,

    // Callback when the toggle status is changed
    onCheckedChange: PropTypes.func,

    // How far the ripple can extend outside the RadioButton's border,
    // default is 16
    extraRippleRadius: PropTypes.number,
    //Toogle editable
    enabled : PropTypes.bool,
  };

  // ## <section id='defaults'>Defaults</section>
  static defaultProps = {
    pointerEvents: 'box-only',
    maskColor: MKColor.Transparent,
    enabled : true,
    style: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 20,
      height: 20,
      borderWidth: 2,
      borderRadius: 10,
    },
  };

  constructor(props) {
    super(props);
    this.theme = getTheme();
    this._animatedSize = new Animated.Value(0);
    this._animatedRadius = new Animated.Value(0);
    this._group = null;
    this.state = {
      checked: false,
      width: 0,
      height: 0,
      enabled : true
    };
  }

  componentWillMount() {
    this.group = this.props.group;
    this._initView(this.props.checked, this.props.enabled);
  }

  componentWillReceiveProps(nextProps) {
    this.group = nextProps.group;
    if (nextProps.checked !== this.props.checked || nextProps.enabled !== this.props.enabled ) {
      this._initView(nextProps.checked, nextProps.enabled);
    }
  }

  _initView(checked, enabled) {
    this.setState({ checked, enabled });
    this._aniChecked(checked);
  }

  // property initializers begin
  _onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (width === this.state.width && height === this.state.height) {
      return;
    }

    const padding = this.props.extraRippleRadius || DEFAULT_EXTRA_RIPPLE_RADII;
    this.setState({
      width: width + padding,
      height: height + padding,
    });
  };

  // Touch events handling
  _onTouch = (evt) => {
    if (evt.type === 'TOUCH_UP' && this.state.enabled) {
      if (!this.state.checked) {
        this.confirmToggle();
      }
    }
  };
  // property initializers end

  // When a toggle action (from the given state) is confirmed.
  confirmToggle() {
    if(this.state.enabled === false){
      return;
    }
    const prevState = this.state.checked;
    const newState = !prevState;

    this.setState({ checked: newState }, () => {
      this._emitCheckedChange(newState);
    });

    // update state of the other buttons in the group
    if (this.group) {
      this.group.onChecked(this, newState);
    }

    this._aniChecked(newState);
  }

  confirmUncheck() {
    this.setState({ checked: false }, () => {
      this._emitCheckedChange(false);
    });

    this._aniChecked(false);
  }

  _emitCheckedChange(checked) {
    if (this.props.onCheckedChange) {
      this.props.onCheckedChange({ checked });
    }
  }

  // animate the checked state, by scaling the inner circle
  _aniChecked(checked) {
    Animated.parallel([
      Animated.timing(this._animatedRadius, {
        toValue: checked ? 5 : 0,
        duration: 220,
      }),
      Animated.timing(this._animatedSize, {
        toValue: checked ? 10 : 0,
        duration: 220,
      }),
    ]).start();
  }

  render() {
    const defaultStyle = this.theme.radioStyle;
    let properties = [
      'borderOnColor' ,
      'borderOffColor',
      'fillColor',
      'rippleColor',
    ]
      
    if(!this.state.enabled){
      properties = [
        'disabledBorderOnColor' ,
        'disabledBorderOffColor',
        'disabledFillColor',
        'disabledRippleColor',
      ]
    }
    const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, properties));
    const borderColor = this.state.checked ? 
            (this.state.enabled ? mergedStyle.borderOnColor : mergedStyle.disabledBorderOnColor) : 
            (this.state.enabled ? mergedStyle.borderOffColor : mergedStyle.disabledBorderOffColor);
    let ParentContentComponent;
    if(this.state.enabled){
      ParentContentComponent = Ripple
    }else{
      ParentContentComponent = View
    }        
    return (
      <TouchableWithoutFeedback {...utils.extractTouchableProps(this)} >
        <ParentContentComponent
          {...this.props}
          maskBorderRadiusInPercent={50}
          rippleLocation="center"
          rippleColor={ this.state.enabled ? mergedStyle.rippleColor : mergedStyle.disabledRippleColor}
          onTouch={this._onTouch}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: this.state.width,
            height: this.state.height,
          }}
        >
          <View ref="outerCircle"
            style={[
              RadioButton.defaultProps.style,
              { borderColor },
              this.props.style,
            ]}
            onLayout={this._onLayout}
          >
            <Animated.View
              ref="innerCircle"
              style={{
                backgroundColor: (this.state.enabled) ? mergedStyle.fillColor : mergedStyle.disabledFillColor,
                width: this._animatedSize,
                height: this._animatedSize,
                borderRadius: this._animatedRadius,
              }}
            />
          </View>
        </ParentContentComponent>
      </TouchableWithoutFeedback>
    );
  }
}

Object.defineProperty(RadioButton.prototype, 'group', {
  // Set the group of this radio
  set(group) {
    this._group = group;
    if (group) {
      group.add(this);
    }
  },
  // Retrieve the group of this radio
  get() {
    return this._group;
  },
  enumerable: true,
});


//
// ## <section id='Group'>Group</section>
// Managing a group of radio buttons.
class Group {
  constructor() {
    this.buttons = [];
  }

  add(btn) {
    if (this.buttons.indexOf(btn) < 0) {
      this.buttons.push(btn);
    }
  }

  onChecked(btn, checked) {
    if (checked) {
      this.buttons.forEach((it) => it !== btn && it.confirmUncheck());
    }
  }
}


// ## Public interface
module.exports = RadioButton;
RadioButton.Group = Group;
