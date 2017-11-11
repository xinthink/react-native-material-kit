//
// MDL style indeterminate progress bar component.
//
// - @see [MDL Progress Bar](http://www.getmdl.io/components/index.html#loading-section/progress)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 16/2/13.
//

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from '../utils';

import {
  Animated,
  Easing,
  View
} from 'react-native';

import { getTheme } from '../theme';

//
// ## <section id='IndeterminateProgress'>IndeterminateProgress</section>
// Progress Bar with Indeterminate Progress.
//
class IndeterminateProgress extends Component {

  // ## <section id='Props'>Props</section>
  static propTypes = {
    // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
    ...(ViewPropTypes || View.propTypes),

    // Color of the progress layer
    progressColor: PropTypes.string,

    // Animation duration (milliseconds)
    progressAniDuration: PropTypes.number,
  };

  // ## <section id='Defaults'>Defaults</section>
  static defaultProps = {
    style: {
      height: 4,
    },
  };

  constructor(props) {
    super(props);
    this.theme = getTheme();
    this._totalLength = 0;  // line length when progress is 100%
    this._height = new Animated.Value(0);  // height of the progress or line width
    this._animatedBlock1 = {  // state of the 1st progress block
      left: new Animated.Value(0),
      right: new Animated.Value(0),
    };
    this._animatedBlock2 = {  // state of the 2nd progress block
      left: new Animated.Value(0),
      right: new Animated.Value(0),
    };
    this._aniUpdateProgress = this._aniUpdateProgress.bind(this);
  }

  // property initializers begin
  _onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (width > 0 && this._totalLength !== width) {
      this._totalLength = width;
      this._height.setValue(height);
      this._aniUpdateProgress();
    }
  };
  // property initializers end

  _aniUpdateProgress() {
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
  }

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

  render() {
    const progressTheme = this.theme.progressStyle;
    const style = {
      backgroundColor: progressTheme.backgroundColor,
    };
    const progressColor = this.props.progressColor || progressTheme.progressColor;

    return (
      <View  // the background layer
        ref="bg"
        style={[IndeterminateProgress.defaultProps.style, style, this.props.style]}
        onLayout={this._onLayout}
      >
        <Animated.View  // the 1st animated progress block
          style={{
            backgroundColor: progressColor,
            position: 'absolute',
            left: this._animatedBlock1.left,
            right: this._animatedBlock1.right,
            height: this._height,
          }}
        />
        <Animated.View  // the 2nd animated progress block
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
}


// ## Public interface
module.exports = IndeterminateProgress;
