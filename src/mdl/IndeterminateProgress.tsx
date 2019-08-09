/**
 * MDL style indeterminate progress bar component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL Progress Bar}
 *
 * Created by ywu on 16/2/13.
 */
import React, { Component } from 'react';
import { Animated, Easing, LayoutChangeEvent, View } from 'react-native';

import { getTheme } from '../theme';
import { defaultSimpleProps, SimpleProgressProps } from './progress_common';

/**
 * Indeterminate linear progress indicator.
 *
 * @remarks
 * Continually growing and shrinking along the track until the process is complete. See {@link SimpleProgressProps} for the available props.
 *
 * Refer to {@link https://material.io/design/components/progress-indicators.html#linear-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL implementation}
 */
export default class IndeterminateProgress extends Component<SimpleProgressProps> {
  /** Defaults, see {@link defaultSimpleProps} */
  static defaultProps = defaultSimpleProps;

  /** Reference to App's {@link Theme} */
  private theme = getTheme();

  /** line length when progress is 100% */
  private _totalLength = 0;

  /** height of the progress or line width */
  private _height = new Animated.Value(0);

  /** state of the 1st progress block */
  private _animatedBlock1: any;

  /** state of the 2nd progress block */
  private _animatedBlock2: any;

  constructor(props: SimpleProgressProps) {
    super(props);
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

    return (
      <View // the background layer
        style={[defaultSimpleProps.style, style, this.props.style]}
        onLayout={this._onLayout}
      >
        <Animated.View // the 1st animated progress block
          style={{
            backgroundColor: progressColor,
            position: 'absolute',
            left: this._animatedBlock1.left,
            right: this._animatedBlock1.right,
            height: this._height,
          }}
        />
        <Animated.View // the 2nd animated progress block
          style={{
            backgroundColor: progressColor,
            position: 'absolute',
            left: this._animatedBlock2.left,
            right: this._animatedBlock2.right,
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
      this._aniUpdateProgress();
    }
  };

  private _aniUpdateProgress = () => {
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
  // property initializers end

  private _getBlock2Ani() {
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
