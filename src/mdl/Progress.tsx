/**
 * MDL style progress bar component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL Progress Bar}
 *
 * Created by ywu on 15/8/7.
 */
import React, { Component } from 'react';
import { Animated, Easing, LayoutChangeEvent, View } from 'react-native';

import { getTheme } from '../theme';
import IndeterminateProgress from './IndeterminateProgress';
import { defaultProps, ProgressProps } from './progress_common';

/**
 * Determinate linear progress indicator.
 *
 * @remarks
 * Increasing in width from 0 to 100% of the track, in sync with the process’s progress, with a simplified buffering effect.
 * Refer to {@link https://material.io/design/components/progress-indicators.html#linear-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL implementation}
 */
export default class Progress extends Component<ProgressProps> {
  /** The indeterminate version of {@link Progress} */
  static Indeterminate = IndeterminateProgress;

  /** Defaults, see {@link defaultSimpleProps} */
  static defaultProps = defaultProps;

  /** Reference to App's {@link Theme} */
  private theme = getTheme();

  /** current progress value, [0, 1] */
  private _progress = 0;

  /** current buffering value, [0, 1] */
  private _buffer = 0;

  /** line length when progress is 100% */
  private _totalLength = 0;

  /** height of the progress or line width */
  private _height = new Animated.Value(0);

  private _animatedLength = new Animated.Value(0);
  private _animatedBufferLength = new Animated.Value(0);

  constructor(props: ProgressProps) {
    super(props);
  }

  /** Update progress with animation */
  set progress(value: number) {
    if (value >= 0 && value <= 1 && value !== this._progress) {
      this._progress = value;
      this._aniUpdateProgress(value);
    }
  }

  /** Get current progress */
  get progress(): number {
    return this._progress;
  }

  /** Update buffering progress with animation */
  set buffer(value: number) {
    if (value >= 0 && value !== this._buffer) {
      this._buffer = value;
      this._aniUpdateBuffer(value);
    }
  }

  /** Get current buffering progress */
  get buffer(): number {
    return this._buffer;
  }

  UNSAFE_componentWillMount() {
    this.progress = this.props.progress || 0;
    this.buffer = this.props.buffer || 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps: ProgressProps) {
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

    return (
      <View // the background layer
        style={[defaultProps.style, style, this.props.style]}
        onLayout={this._onLayout}
      >
        <Animated.View // the buffering layer
          style={{
            position: 'absolute',
            backgroundColor: bufferColor,
            width: this._animatedBufferLength,
            height: this._height,
          }}
        />
        <Animated.View // the forefront layer showing progress
          style={{
            position: 'absolute',
            backgroundColor: progressColor,
            width: this._animatedLength,
            height: this._height,
          }}
        />
      </View>
    );
  }

  // property initializers begin
  private _onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }: LayoutChangeEvent) => {
    if (width > 0 && this._totalLength !== width) {
      this._totalLength = width;
      this._height.setValue(height);
      this._aniUpdateProgress(this.progress);
      this._aniUpdateBuffer(this.buffer);
    }
  };
  // property initializers end

  private _aniUpdateProgress(theProgress: number) {
    if (!(this._totalLength > 0 && theProgress >= 0)) {
      return;
    }

    Animated.timing(this._animatedLength, {
      toValue: theProgress * this._totalLength,
      duration: this.props.progressAniDuration || 300,
      easing: Easing.out(Easing.quad),
    }).start();
  }

  private _aniUpdateBuffer(buffer: number) {
    if (!(this._totalLength > 0 && buffer >= 0)) {
      return;
    }

    Animated.timing(this._animatedBufferLength, {
      toValue: buffer * this._totalLength,
      duration: this.props.bufferAniDuration || 200,
    }).start();
  }
}
