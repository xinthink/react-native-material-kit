/**
 * MDL-style Radio button component.
 *
 * See [MDL Radio Button](http://www.getmdl.io/components/index.html#toggles-section/radio)
 *
 * Created by ywu on 15/10/12.
 */
import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, View, } from 'react-native';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
import * as utils from '../utils';
import Ripple from './Ripple';
const DEFAULT_EXTRA_RIPPLE_RADII = 16;
/** Default props of {@link RadioButton} */
const defaultProps = {
    maskColor: MKColor.Transparent,
    pointerEvents: 'box-only',
    style: {
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        height: 20,
        justifyContent: 'center',
        width: 20,
    },
};
/**
 * The `RadioButton` component.
 *
 * @remarks
 * See {@link https://material.io/components/selection-controls/#radio-buttons | Guideline} & {@link http://www.getmdl.io/components/index.html#toggles-section/radio | MDL implementation}
 */
export default class RadioButton extends Component {
    constructor(props) {
        super(props);
        this.theme = getTheme();
        this.animatedSize = new Animated.Value(0);
        this.animatedRadius = new Animated.Value(0);
        /** Layout event handler */
        this.onLayout = ({ nativeEvent: { layout: { width, height }, }, }) => {
            if (width === this.state.width && height === this.state.height) {
                return;
            }
            const padding = this.props.extraRippleRadius || DEFAULT_EXTRA_RIPPLE_RADII;
            this.setState({
                height: height + padding,
                width: width + padding,
            });
        };
        /** Touch event handler */
        this.onTouch = ({ type }) => {
            if (type === 'TOUCH_UP') {
                if (!this.state.checked) {
                    this.confirmToggle();
                }
            }
        };
        this.state = {
            checked: false,
            height: 0,
            width: 0,
        };
    }
    UNSAFE_componentWillMount() {
        this.group = this.props.group;
        this.initView(this.props.checked);
        this.group && this.group.add(this);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.group !== nextProps.group) {
            this.group && this.group.remove(this);
            this.group = nextProps.group;
            this.group && this.group.add(this);
        }
        if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
            this.initView(nextProps.checked);
        }
    }
    componentWillUnmount() {
        this.group && this.group.remove(this);
    }
    // When a toggle action (from the given state) is confirmed.
    confirmToggle() {
        const prevState = this.state.checked;
        const newState = !prevState;
        this.setState({ checked: newState }, () => this.emitCheckedChange(newState));
        // update state of the other buttons in the group
        this.group && this.group.onChecked(this, newState);
        this.aniChecked(newState);
    }
    confirmUncheck() {
        this.setState({ checked: false }, () => this.emitCheckedChange(false));
        this.aniChecked(false);
    }
    render() {
        const defaultStyle = this.theme.radioStyle;
        const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, ['borderOnColor', 'borderOffColor', 'fillColor', 'rippleColor']));
        const borderColor = this.state.checked ? mergedStyle.borderOnColor : mergedStyle.borderOffColor;
        return (<TouchableWithoutFeedback {...utils.extractTouchableProps(this)}>
        <Ripple {...this.props} maskBorderRadiusInPercent={50} rippleLocation="center" rippleColor={mergedStyle.rippleColor} onTouch={this.onTouch} style={{
            alignItems: 'center',
            height: this.state.height,
            justifyContent: 'center',
            width: this.state.width,
        }}>
          <View style={[defaultProps.style, { borderColor }, this.props.style]} onLayout={this.onLayout}>
            <Animated.View style={{
            backgroundColor: mergedStyle.fillColor,
            borderRadius: this.animatedRadius,
            height: this.animatedSize,
            width: this.animatedSize,
        }}/>
          </View>
        </Ripple>
      </TouchableWithoutFeedback>);
    }
    initView(checked = false) {
        this.setState({ checked });
        this.aniChecked(checked);
    }
    emitCheckedChange(checked) {
        this.props.onCheckedChange && this.props.onCheckedChange({ checked });
    }
    /** animate the checked state, by scaling the inner circle */
    aniChecked(checked) {
        Animated.parallel([
            Animated.timing(this.animatedRadius, {
                duration: 220,
                toValue: checked ? 5 : 0,
            }),
            Animated.timing(this.animatedSize, {
                duration: 220,
                toValue: checked ? 10 : 0,
            }),
        ]).start();
    }
}
/** Default props */
RadioButton.defaultProps = defaultProps;
//# sourceMappingURL=RadioButton.js.map