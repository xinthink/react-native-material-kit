/**
 * `FloatingLabel` component of {@link Textfield}s.
 */
import React, { Component, createRef } from 'react';
import { Animated, findNodeHandle, UIManager, } from 'react-native';
import MKColor from '../../MKColor';
/** Defaults of {@link FloatingLabelProps} */
const defaultProps = {
    floatingLabelEnabled: true,
    floatingLabelAniDuration: 200,
    opacityAniDur: 0,
};
/**
 * The `FloatingLabel` component of a {@link Textfield}.
 */
export default class FloatingLabel extends Component {
    constructor(props) {
        super(props);
        this.offsetX = 0;
        this.placeholderHeight = 0;
        this.labelRef = createRef();
        this._onLabelLayout = ({ nativeEvent: { layout } }) => {
            const { x, width, height } = layout;
            if (width && !this.offsetX) {
                this.offsetX = (-1 * (width - width * 0.8)) / 2 - x;
            }
            if (height && !this.placeholderHeight) {
                this.placeholderHeight = height;
            }
            if (width !== this.labelDim.width || height !== this.labelDim.height) {
                this.labelDim = { width, height };
            }
        };
        this.labelDim = { width: 0, height: 0 };
        this.state = {
            progress: new Animated.Value(1),
            opacity: new Animated.Value(0),
            label: '',
        };
    }
    UNSAFE_componentWillMount() {
        this.updateLabel(this.props.label);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.updateLabel(nextProps.label);
    }
    /** Update the label text */
    updateLabel(label) {
        this.setState({ label: label || '' });
    }
    /**
     * Determines the location on screen, width, and height of the given view and
     * returns the values via an async callback.
     */
    measure(cb) {
        if (this.labelRef.current) {
            const handle = findNodeHandle(this.labelRef.current);
            handle && UIManager.measure(handle, cb);
        }
    }
    /** Start the floating animation */
    aniFloatLabel() {
        return this.props.floatingLabelEnabled
            ? [
                Animated.sequence([
                    Animated.timing(this.state.opacity, {
                        toValue: 1,
                        duration: this.props.opacityAniDur,
                    }),
                    Animated.timing(this.state.progress, {
                        toValue: 0,
                        duration: this.props.floatingLabelAniDuration,
                    }),
                ]),
            ]
            : [];
    }
    /** Start the collapse animation */
    aniSinkLabel() {
        return this.props.floatingLabelEnabled
            ? [
                Animated.sequence([
                    Animated.timing(this.state.progress, {
                        toValue: 1,
                        duration: this.props.floatingLabelAniDuration,
                    }),
                    Animated.timing(this.state.opacity, {
                        toValue: 0,
                        duration: this.props.opacityAniDur,
                    }),
                ]),
            ]
            : [];
    }
    render() {
        const labelColor = this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [this.props.highlightColor, this.props.tint],
        });
        const labelScale = this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
        });
        const labelY = this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.placeholderHeight],
        });
        const labelX = this.state.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [this.offsetX, 0],
        });
        return (<Animated.Text ref={this.labelRef} pointerEvents="none" allowFontScaling={this.props.allowFontScaling} style={[
            {
                backgroundColor: MKColor.Transparent,
                position: 'absolute',
                top: labelY,
                left: labelX,
                color: labelColor,
                opacity: this.state.opacity,
                fontSize: 16,
                transform: [{ scale: labelScale }],
                marginBottom: this.props.floatingLabelBottomMargin,
            },
            this.props.floatingLabelFont,
        ]} onLayout={this._onLabelLayout}>
        {this.state.label}
      </Animated.Text>);
    }
}
/** Defaults, see {@link defaultProps} */
FloatingLabel.defaultProps = defaultProps;
//# sourceMappingURL=FloatingLabel.js.map