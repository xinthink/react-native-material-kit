/**
 * MDL-style Checkbox component.
 *
 * See {@link http://www.getmdl.io/components/index.html#toggles-section/checkbox | MDL Checkbox}
 *
 * Created by ywu on 15/12/13.
 */
import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, View, } from 'react-native';
import { AnimatedTick } from '../internal/Tick';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
import * as utils from '../utils';
import Ripple from './Ripple';
const DEFAULT_EXTRA_RIPPLE_RADII = 5;
/** Default props of {@link Checkbox} */
const defaultProps = {
    checked: false,
    editable: true,
    maskColor: MKColor.Transparent,
    pointerEvents: 'box-only',
    style: {
        height: 20,
        width: 20,
        alignItems: 'center',
        borderRadius: 1,
        borderWidth: 2,
        justifyContent: 'center',
        overflow: 'hidden',
    },
};
/**
 * The `Checkbox` component.
 *
 * @remarks
 * See {@link https://material.io/components/selection-controls/#checkboxes | Guideline} & {@link http://www.getmdl.io/components/index.html#toggles-section/checkbox | MDL implementation}
 */
export default class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.theme = getTheme();
        this.animatedTickAlpha = new Animated.Value(0);
        /** Layout event handler */
        this.onLayout = ({ nativeEvent: { layout: { width, height }, }, }) => {
            if (width === this.state.width && height === this.state.height) {
                return;
            }
            const size = Math.min(width, height);
            const rippleRadii = (size * Math.SQRT2) / 2 + (this.props.extraRippleRadius || DEFAULT_EXTRA_RIPPLE_RADII);
            this.setState({
                rippleRadii,
                height: rippleRadii * 2,
                width: rippleRadii * 2,
            });
        };
        /** Touch event handler */
        this.onTouch = ({ type }) => {
            if (type === 'TOUCH_UP' && this.props.editable) {
                this.confirmToggle();
            }
        };
        this.state = {
            checked: false,
            height: 0,
            rippleRadii: 0,
            width: 0,
        };
    }
    UNSAFE_componentWillMount() {
        this.initView(this.props.checked);
    }
    /**
     * TODO using controlled components.
     * @see https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html?#preferred-solutions
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked && nextProps !== this.state.checked) {
            this.initView(nextProps.checked || false);
        }
    }
    render() {
        const defaultStyle = this.theme.checkboxStyle;
        const mergedStyle = Object.assign({}, defaultStyle, utils.extractProps(this, ['borderOnColor', 'borderOffColor', 'fillColor', 'rippleColor', 'inset']));
        const borderColor = this.state.checked ? mergedStyle.borderOnColor : mergedStyle.borderOffColor;
        return (<TouchableWithoutFeedback {...utils.extractTouchableProps(this)}>
        <Ripple {...this.props} maskBorderRadiusInPercent={50} rippleLocation="center" rippleColor={mergedStyle.rippleColor} onTouch={this.onTouch} style={{
            alignItems: 'center',
            height: this.state.height,
            justifyContent: 'center',
            width: this.state.width,
        }}>
          <View style={[
            defaultProps.style,
            this.props.style,
            {
                alignItems: 'stretch',
                borderColor,
            },
        ]} onLayout={this.onLayout}>
            <AnimatedTick inset={mergedStyle.inset} fillColor={mergedStyle.fillColor} style={{
            flex: 1,
            opacity: this.animatedTickAlpha,
        }}/>
          </View>
        </Ripple>
      </TouchableWithoutFeedback>);
    }
    initView(checked = false) {
        this.setState({ checked });
        this.aniToggle(checked);
    }
    /** animate the checked state, by scaling the inner circle */
    aniToggle(checked) {
        Animated.timing(this.animatedTickAlpha, {
            duration: 220,
            toValue: checked ? 1 : 0,
        }).start();
    }
    /** When a toggle action (from the given state) is confirmed. */
    confirmToggle() {
        const prevState = this.state.checked;
        const newState = !prevState;
        this.setState({ checked: newState }, () => {
            if (this.props.onCheckedChange) {
                this.props.onCheckedChange({ checked: this.state.checked });
            }
        });
        this.aniToggle(newState);
    }
}
/** Default props */
Checkbox.defaultProps = defaultProps;
//# sourceMappingURL=Checkbox.js.map