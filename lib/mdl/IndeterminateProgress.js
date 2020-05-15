/**
 * MDL style indeterminate progress bar component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL Progress Bar}
 *
 * Created by ywu on 16/2/13.
 */
import React, { Component } from 'react';
import { Animated, Easing, View } from 'react-native';
import { getTheme } from '../theme';
import { defaultSimpleProps } from './progress_common';
/**
 * Indeterminate linear progress indicator.
 *
 * @remarks
 * Continually growing and shrinking along the track until the process is complete. See {@link SimpleProgressProps} for the available props.
 *
 * Refer to {@link https://material.io/design/components/progress-indicators.html#linear-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL implementation}
 */
export default class IndeterminateProgress extends Component {
    constructor(props) {
        super(props);
        /** Reference to App's {@link Theme} */
        this.theme = getTheme();
        /** line length when progress is 100% */
        this._totalLength = 0;
        /** height of the progress or line width */
        this._height = new Animated.Value(0);
        // property initializers begin
        this._onLayout = ({ nativeEvent: { layout: { width, height }, }, }) => {
            if (width > 0 && this._totalLength !== width) {
                this._totalLength = width;
                this._height.setValue(height);
                this._aniUpdateProgress();
            }
        };
        this._aniUpdateProgress = () => {
            if (!(this._totalLength > 0)) {
                return;
            }
            this._animatedBlock1.left.setValue(0);
            this._animatedBlock1.right.setValue(this._totalLength);
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this._animatedBlock1.left, {
                        toValue: this._totalLength * 0.25,
                        duration: this.props.progressAniDuration || 1250,
                    }),
                    Animated.timing(this._animatedBlock1.right, {
                        toValue: 0,
                        duration: this.props.progressAniDuration || 1250,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(this._animatedBlock1.left, {
                        toValue: this._totalLength,
                        duration: this.props.progressAniDuration || 500,
                        easing: Easing.out(Easing.quad),
                    }),
                    this._getBlock2Ani(),
                ]),
            ]).start(({ finished }) => finished && setImmediate(this._aniUpdateProgress));
        };
        this._animatedBlock1 = {
            left: new Animated.Value(0),
            right: new Animated.Value(0),
        };
        this._animatedBlock2 = {
            left: new Animated.Value(0),
            right: new Animated.Value(0),
        };
    }
    /** {@inheritDoc @types/react#Component.render} */
    render() {
        const progressTheme = this.theme.progressStyle;
        const style = {
            // @ts-ignore
            backgroundColor: progressTheme.backgroundColor,
        };
        // @ts-ignore
        const progressColor = this.props.progressColor || progressTheme.progressColor;
        return (<View // the background layer
         style={[defaultSimpleProps.style, style, this.props.style]} onLayout={this._onLayout}>
        <Animated.View // the 1st animated progress block
         style={{
            backgroundColor: progressColor,
            position: 'absolute',
            left: this._animatedBlock1.left,
            right: this._animatedBlock1.right,
            height: this._height,
        }}/>
        <Animated.View // the 2nd animated progress block
         style={{
            backgroundColor: progressColor,
            position: 'absolute',
            left: this._animatedBlock2.left,
            right: this._animatedBlock2.right,
            height: this._height,
        }}/>
      </View>);
    }
    // property initializers end
    _getBlock2Ani() {
        this._animatedBlock2.left.setValue(0);
        this._animatedBlock2.right.setValue(this._totalLength);
        return Animated.sequence([
            Animated.timing(this._animatedBlock2.right, {
                toValue: this._totalLength * 0.75,
                duration: this.props.progressAniDuration || 500,
            }),
            Animated.parallel([
                Animated.timing(this._animatedBlock2.left, {
                    toValue: this._totalLength,
                    duration: this.props.progressAniDuration || 705,
                    easing: Easing.out(Easing.quad),
                }),
                Animated.timing(this._animatedBlock2.right, {
                    toValue: 0,
                    duration: this.props.progressAniDuration || 700,
                    easing: Easing.out(Easing.quad),
                }),
            ]),
        ]);
    }
}
/** Defaults, see {@link defaultSimpleProps} */
IndeterminateProgress.defaultProps = defaultSimpleProps;
//# sourceMappingURL=IndeterminateProgress.js.map