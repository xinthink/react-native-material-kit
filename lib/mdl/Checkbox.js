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
  PropTypes,
} from 'react';

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

    // Color of the border (outer circle), when checked and disabled
    disabledBorderOnColor: PropTypes.string,

    // Color of the border (outer circle), when unchecked and disabled
    disabledBborderOffColor: PropTypes.string,

    // Color of the inner circle, when checked and disabled
    disabledFillColor: PropTypes.string,

    // Toggle status
    checked: PropTypes.bool,

    // Callback when the toggle status is changed
    onCheckedChange: PropTypes.func,

    // How far the ripple can extend outside the Checkbox's border,
    // default is 5
    extraRippleRadius: PropTypes.number,

    // Toggle Editable
    editable: PropTypes.bool,

    //Toogle editable
    enable : PropTypes.bool,
  };

  // ## <section id='defaults'>Defaults</section>
  static defaultProps = {
    pointerEvents: 'box-only',
    maskColor: MKColor.Transparent,    
    enable : true,
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
      enable : true
    };
  }

  componentWillMount() {
    //!@depreacated
    let enable = this.props.enable
    if(this.props.editable !== undefined){
      enable = this.props.editable
      console.warn('Editable props of MKCheckbox is depreacated. Use editable instead')
    }
    this._initView(this.props.checked, enable);
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
    if (evt.type === 'TOUCH_UP' && this.state.enable ){
      this.confirmToggle();
    }
  };
  // property initializers end

  _initView(checked, enable) {
    this.setState({ 'checked' : checked , 'enable' : enable });
    this._aniToggle(checked);
  }

  // When a toggle action (from the given state) is confirmed.
  confirmToggle() {
    if(this.state.enable === false){
      return;
    }
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
    let mergedStyle;
    let borderColor;
    if(this.state.enable === true){
      mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, [
      'borderOnColor' ,
      'borderOffColor',
      'fillColor',
      'rippleColor',
      'inset',
      ]));
      borderColor = this.state.checked ? mergedStyle.borderOnColor : mergedStyle.borderOffColor;
    }else{
      mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, [
      'disabledDorderOnColor' ,
      'disableBorderOffColor',
      'disabledFillColor',
      'rippleColor',
      ]));
      mergedStyle.fillColor = mergedStyle.disabledFillColor
      borderColor = this.state.checked ? mergedStyle.disabledBorderOnColor : mergedStyle.disabledBorderOffColor;
    }
    
    let ParentContentComponent;
    if(this.state.enable){
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
        </ParentContentComponent>
      </TouchableWithoutFeedback>
    );
  }
}


// ## Public interface
module.exports = Checkbox;
