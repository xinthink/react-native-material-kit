/**
 * `Underline` component of {@link Textfield}s.
 */
import React, { Component } from 'react';
import { Animated, View } from 'react-native';
const defaultProps = {
    underlineEnabled: true,
    underlineAniDur: 200,
    underlineSize: 2,
};
/**
 * `Underline` component of a {@link Textfield}.
 */
export default class Underline extends Component {
    constructor(props) {
        super(props);
        this.animatedLeft = new Animated.Value(0);
        this.animatedLineLength = new Animated.Value(0);
        this.render = () => (<View pointerEvents="none" style={{
            // top: -this.props.underlineSize,
            height: this.props.underlineSize,
        }}>
      <View // the default silver border
         style={{
            backgroundColor: this.props.tint,
            position: 'absolute',
            height: this.props.underlineSize,
            width: this.state.lineLength,
        }}/>
      {this.renderUnderline()}
    </View>);
        /** the colorful forefront line, animation enabled */
        this.renderUnderline = () => this.props.underlineEnabled && (<Animated.View style={{
            backgroundColor: this.props.highlightColor,
            position: 'absolute',
            left: this.animatedLeft,
            height: this.props.underlineSize,
            width: this.animatedLineLength,
        }}/>);
        this.state = {
            lineLength: 0,
        };
    }
    /** update the length of stretched underline */
    updateLineLength(lineLength, cb) {
        this.setState({ lineLength }, cb);
    }
    /** stretch the line, from center */
    aniStretchUnderline(focused) {
        if (!this.props.underlineEnabled || !focused) {
            return [];
        }
        this.animatedLeft.setValue(this.state.lineLength / 2);
        return [
            Animated.timing(this.animatedLeft, {
                toValue: 0,
                duration: this.props.underlineAniDur,
            }),
            Animated.timing(this.animatedLineLength, {
                toValue: this.state.lineLength,
                duration: this.props.underlineAniDur,
            }),
        ];
    }
    /** collapse the the line to a single point at center */
    aniShrinkUnderline() {
        return this.props.underlineEnabled
            ? [
                Animated.timing(this.animatedLeft, {
                    toValue: this.state.lineLength / 2,
                    duration: this.props.underlineAniDur,
                }),
                Animated.timing(this.animatedLineLength, {
                    toValue: 0,
                    duration: this.props.underlineAniDur,
                }),
            ]
            : [];
    }
}
/** Defaults, see {@link defaultProps} */
Underline.defaultProps = defaultProps;
//# sourceMappingURL=Underline.js.map