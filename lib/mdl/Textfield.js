/**
 * MDL style textfield component.
 *
 * See {@link http://www.getmdl.io/components/index.html#textfields-section | MDL Textfield}
 *
 * Created by ywu on 15/8/3.
 */
import React, { Component, createRef } from 'react';
import { Animated, TextInput, View, } from 'react-native';
import FloatingLabel from '../internal/textfield/FloatingLabel';
import Underline from '../internal/textfield/Underline';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
/** Default props of the {@link Textfield} component */
const defaultProps = {
    // tintColor: 'rgba(0,0,0,.12)',
    // highlightColor: getTheme().primaryColor,
    // floatingLabelFont: {
    //   fontSize: getTheme().fontSize - 2,
    // },
    style: {
        height: 39,
    },
    // textInputStyle: {
    //   color: getTheme().fontColor,
    //   fontSize: getTheme().fontSize + 2,
    //   paddingLeft: 0,
    //   paddingRight: 0,
    // },
    floatingLabelEnabled: true,
    floatingLabelAniDuration: 200,
    underlineEnabled: true,
    underlineSize: 2,
};
/**
 * The `Textfield` component, which has an optional {@link FloatingLabel} and {@link Underline}.
 * - TODO styling `read-only` & `disabled` mode
 */
export default class Textfield extends Component {
    constructor(props) {
        super(props);
        this.theme = getTheme();
        this.inputRef = createRef();
        this.labelRef = createRef();
        this.underlineRef = createRef();
        this._onTextChange = (text) => {
            this.bufferedValue = text;
            this._callback('onTextChange', text);
            this._callback('onChangeText', text);
        };
        this._onFocus = (e) => {
            this._aniStartHighlight(true);
            this._callback('onFocus', e);
        };
        this._onBlur = (e) => {
            this._aniStopHighlight();
            this._callback('onBlur', e);
        };
        this._doMeasurement = () => {
            if (this.inputRef.current) {
                this.inputRef.current.measure(this._onInputMeasured);
            }
            if (this.props.floatingLabelEnabled && this.labelRef.current) {
                this.labelRef.current.measure(this._onLabelMeasured);
            }
        };
        this._onLabelMeasured = (left, top, width, height) => {
            this.setState({ inputMarginTop: height });
        };
        this._onInputMeasured = (left, top, width, height) => {
            Object.assign(this.inputFrame, { left, top, width, height });
            if (this.underlineRef.current) {
                this.underlineRef.current.updateLineLength(width, () => {
                    if (this.bufferedValue || this.isFocused()) {
                        this._aniStartHighlight(this.isFocused()); // if input not empty, lift the label
                    }
                });
            }
        };
        this.inputFrame = { left: 0, top: 0, width: 0, height: 0 };
        this.state = {
            inputMarginTop: 0,
        };
    }
    set bufferedValue(v) {
        this._bufferedValue = v;
        if (v) {
            this._aniFloatLabel();
        }
    }
    get bufferedValue() {
        return (this._bufferedValue || '').trim();
    }
    set placeholder(placeholder) {
        this.inputRef.current &&
            this.inputRef.current.setNativeProps({
                placeholder,
                text: this._bufferedValue,
            });
    }
    /**
     * Requests focus for the given input or view. The exact behavior triggered
     * will depend on the platform and type of view.
     */
    focus() {
        this.inputRef.current && this.inputRef.current.focus();
    }
    /**
     * Checks if the input is currently focused.
     */
    isFocused() {
        return (this.inputRef.current && this.inputRef.current.isFocused()) === true;
    }
    /**
     * Removes focus from an input or view. This is the opposite of `focus()`.
     */
    blur() {
        this.inputRef.current && this.inputRef.current.blur();
    }
    UNSAFE_componentWillMount() {
        this.bufferedValue = this.props.value || this.props.defaultValue;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const newText = nextProps.value || nextProps.defaultValue;
        if (newText) {
            this.bufferedValue = newText;
        }
        if (nextProps.value) {
            this.bufferedValue = nextProps.value;
        }
        else if (nextProps.defaultValue && this.props.defaultValue !== nextProps.defaultValue) {
            // use defaultValue if it's changed
            this.bufferedValue = nextProps.defaultValue;
        }
    }
    componentDidMount() {
        requestAnimationFrame(this._doMeasurement);
    }
    render() {
        const tfTheme = this.theme.textfieldStyle;
        const floatingLabel = this.props.floatingLabelEnabled ? (<FloatingLabel ref={this.labelRef} {...this.props} label={this.props.placeholder} tint={this.props.tint || tfTheme.tintColor} highlightColor={this.props.highlightColor || tfTheme.highlightColor} floatingLabelFont={this.props.floatingLabelFont || tfTheme.floatingLabelFont}/>) : null;
        const underline = (<Underline ref={this.underlineRef} {...this.props} tint={this.props.tint || tfTheme.tintColor} highlightColor={this.props.highlightColor || tfTheme.highlightColor} underlineAniDur={this.props.floatingLabelAniDuration}/>);
        return (<View style={this.props.style} onLayout={this._doMeasurement}>
        {floatingLabel}
        <TextInput ref={this.inputRef} {...this.props} {...this.props.additionalInputProps} style={[
            {
                backgroundColor: MKColor.Transparent,
                alignSelf: 'stretch',
                paddingTop: 2,
                paddingBottom: 2,
                marginTop: this.state.inputMarginTop,
            },
            tfTheme.textInputStyle,
            this.props.textInputStyle,
        ]} onChangeText={this._onTextChange} onFocus={this._onFocus} onBlur={this._onBlur} secureTextEntry={this.props.password} underlineColorAndroid="transparent"/>
        {underline}
      </View>);
    }
    startAnimations(animations, cb) {
        if (animations.length) {
            this.anim && this.anim.stop();
            this.anim = Animated.parallel(animations);
            this.anim.start(cb);
        }
    }
    _aniFloatLabel() {
        if (this.bufferedValue && this.props.floatingLabelEnabled && this.labelRef.current) {
            this.startAnimations(this.labelRef.current.aniFloatLabel());
        }
    }
    // animation when textfield focused
    _aniStartHighlight(focused) {
        if (this.props.floatingLabelEnabled) {
            // hide fixed placeholder, if floating
            this.placeholder = '';
            // and show floating label
            // FIXME workaround https://github.com/facebook/react-native/issues/3220
            if (this.labelRef.current) {
                this.labelRef.current.updateLabel(this.props.placeholder || '');
            }
        }
        if (this.underlineRef.current && this.labelRef.current) {
            this.startAnimations([
                ...this.underlineRef.current.aniStretchUnderline(focused),
                ...this.labelRef.current.aniFloatLabel(),
            ]);
        }
    }
    // animation when textfield lost focus
    _aniStopHighlight() {
        if (this.underlineRef.current && this.labelRef.current) {
            const onEnd = () => {
                if (this.props.floatingLabelEnabled) {
                    // show fixed placeholder after floating label collapsed
                    this.placeholder = this.props.placeholder || '';
                    // and hide floating label
                    // FIXME workaround https://github.com/facebook/react-native/issues/3220
                    if (!this.bufferedValue && this.labelRef.current) {
                        this.labelRef.current.updateLabel('');
                    }
                }
            };
            this.startAnimations([
                ...this.underlineRef.current.aniShrinkUnderline(),
                ...(!this.bufferedValue ? this.labelRef.current.aniSinkLabel() : []),
            ], onEnd);
        }
    }
    _callback(prop, evt) {
        const props = this.props;
        props[prop] && props[prop](evt);
    }
}
/** Defaults, see {@link defaultProps} */
Textfield.defaultProps = defaultProps;
//# sourceMappingURL=Textfield.js.map