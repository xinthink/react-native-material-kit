/**
 * MDL style progress bar component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL Progress Bar}
 *
 * Created by ywu on 15/8/7.
 */
import React, { Component } from 'react';
import { Animated, Easing, View } from 'react-native';
import { getTheme } from '../theme';
import IndeterminateProgress from './IndeterminateProgress';
import { defaultProps } from './progress_common';
/**
 * Determinate linear progress indicator.
 *
 * @remarks
 * Increasing in width from 0 to 100% of the track, in sync with the process’s progress, with a simplified buffering effect.
 * Refer to {@link https://material.io/design/components/progress-indicators.html#linear-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL implementation}
 */
export default class Progress extends Component {
    constructor(props) {
        super(props);
        /** Reference to App's {@link Theme} */
        this.theme = getTheme();
        /** current progress value, [0, 1] */
        this._progress = 0;
        /** current buffering value, [0, 1] */
        this._buffer = 0;
        /** line length when progress is 100% */
        this._totalLength = 0;
        /** height of the progress or line width */
        this._height = 0;
        this._animatedLength = new Animated.Value(0);
        this._animatedBufferLength = new Animated.Value(0);
        // property initializers begin
        this._onLayout = ({ nativeEvent: { layout: { width, height }, }, }) => {
            if (width > 0 && this._totalLength !== width) {
                this._totalLength = width;
                this._height = height;
                this._aniUpdateProgress(this.progress);
                this._aniUpdateBuffer(this.buffer);
            }
        };
    }
    /** Update progress with animation */
    set progress(value) {
        if (value >= 0 && value <= 1 && value !== this._progress) {
            this._progress = value;
            this._aniUpdateProgress(value);
        }
    }
    /** Get current progress */
    get progress() {
        return this._progress;
    }
    /** Update buffering progress with animation */
    set buffer(value) {
        if (value >= 0 && value !== this._buffer) {
            this._buffer = value;
            this._aniUpdateBuffer(value);
        }
    }
    /** Get current buffering progress */
    get buffer() {
        return this._buffer;
    }
    UNSAFE_componentWillMount() {
        this.progress = this.props.progress || 0;
        this.buffer = this.props.buffer || 0;
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.progress = nextProps.progress || 0;
        this.buffer = nextProps.buffer || 0;
    }
    /** {@inheritDoc @types/react#Component.render} */
    render() {
        const progressTheme = this.theme.progressStyle;
        const style = {
            // @ts-ignore
            backgroundColor: progressTheme.backgroundColor,
        };
        // @ts-ignore
        const bufferColor = this.props.bufferColor || progressTheme.bufferColor;
        // @ts-ignore
        const progressColor = this.props.progressColor || progressTheme.progressColor;
        return (<View // the background layer
         style={[defaultProps.style, style, this.props.style]} onLayout={this._onLayout}>
        <Animated.View // the buffering layer
         style={{
            position: 'absolute',
            backgroundColor: bufferColor,
            width: 0,
            height: this._height,
        }}/>
        <Animated.View // the forefront layer showing progress
         style={{
            position: 'absolute',
            backgroundColor: progressColor,
            width: 1,
            height: this._height,
            transform: [{
                    scaleX: this._animatedLength
                }]
        }}/>
      </View>);
    }
    // property initializers end
    _aniUpdateProgress(theProgress) {
        if (!(this._totalLength > 0 && theProgress >= 0)) {
            return;
        }
        Animated.timing(this._animatedLength, {
            toValue: theProgress * this._totalLength,
            duration: this.props.progressAniDuration || 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true
        }).start();
    }
    _aniUpdateBuffer(buffer) {
        if (!(this._totalLength > 0 && buffer >= 0)) {
            return;
        }
        Animated.timing(this._animatedBufferLength, {
            toValue: buffer * this._totalLength,
            duration: this.props.bufferAniDuration || 200,
            useNativeDriver: true
        }).start();
    }
}
/** The indeterminate version of {@link Progress} */
Progress.Indeterminate = IndeterminateProgress;
/** Defaults, see {@link defaultSimpleProps} */
Progress.defaultProps = defaultProps;
//# sourceMappingURL=Progress.js.map