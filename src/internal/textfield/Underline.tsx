/**
 * `Underline` component of {@link Textfield}s.
 */
import React, { Component } from 'react';
import { Animated, View } from 'react-native';

/** Props of the {@link Underline} component */
export interface UnderlinePublicProps {
  /** The highlighted bottom border effect */
  underlineEnabled?: boolean;

  /** The thickness of the Underline */
  underlineSize?: number;
}

export interface UnderlineProps extends UnderlinePublicProps {
  tint?: any;
  highlightColor?: any;

  /** Animation duration of the Underline */
  underlineAniDur?: number;
}

/** State of the {@link Underline} component */
interface UnderlineState {
  lineLength: number;
}

const defaultProps: Partial<UnderlineProps> = {
  underlineEnabled: true,
  underlineAniDur: 200,
  underlineSize: 2,
};

/**
 * `Underline` component of a {@link Textfield}.
 */
export default class Underline extends Component<UnderlineProps, UnderlineState> {
  /** Defaults, see {@link defaultProps} */
  static defaultProps = defaultProps;

  private animatedLeft = new Animated.Value(0);
  private animatedLineLength = new Animated.Value(0);

  constructor(props: UnderlineProps) {
    super(props);
    this.state = {
      lineLength: 0,
    };
  }

  /** update the length of stretched underline */
  updateLineLength(lineLength: number, cb?: () => void) {
    this.setState({ lineLength }, cb);
  }

  /** stretch the line, from center */
  aniStretchUnderline(focused: boolean): Animated.CompositeAnimation[] {
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
  aniShrinkUnderline(): Animated.CompositeAnimation[] {
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

  render = () => (
    <View
      pointerEvents="none"
      style={{
        // top: -this.props.underlineSize,
        height: this.props.underlineSize,
      }}
    >
      <View // the default silver border
        style={{
          backgroundColor: this.props.tint,
          position: 'absolute',
          height: this.props.underlineSize,
          width: this.state.lineLength,
        }}
      />
      {this.renderUnderline()}
    </View>
  );

  /** the colorful forefront line, animation enabled */
  private renderUnderline = () =>
    this.props.underlineEnabled && (
      <Animated.View
        style={{
          backgroundColor: this.props.highlightColor,
          position: 'absolute',
          left: this.animatedLeft,
          height: this.props.underlineSize,
          width: this.animatedLineLength,
        }}
      />
    );
}
