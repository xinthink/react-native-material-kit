//
// MDL style progress bar component.
//
// - @see [MDL Progress Bar](http://www.getmdl.io/components/index.html#loading-section/progress)
// - [Props](#props)
// - [Defaults](#defaults)
//
// Created by ywu on 15/8/7.
//

import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from '../utils';

import {
  Animated,
  Easing,
  View,
} from 'react-native';

import { getTheme } from '../theme';

//
// ## <section id='Progress'>Progress</section>
// The default `Progress` component, with a simplified buffering effect.
//
class Progress extends Component {

  // ## <section id='props'>Props</section>
  static propTypes = {
    // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
    ...(ViewPropTypes || View.propTypes),

    // Initial value of progress, Number: [0, 1.0]
    progress: PropTypes.number,

    // Initial value of buffering, Number: [0, 1.0]
    buffer: PropTypes.number,

    // Color of the progress layer
    progressColor: PropTypes.string,

    // Color of the buffering layer
    bufferColor: PropTypes.string,

    // Duration of the progress animation, in milliseconds
    progressAniDuration: PropTypes.number,

    // Duration of the buffering animation, in milliseconds
    bufferAniDuration: PropTypes.number,
  };

  // ## <section id='defaults'>Defaults</section>
  static defaultProps = {
    style: {
      height: 4,
    },
  };

  constructor(props) {
    super(props);
    this.theme = getTheme();
    this._progress = 0;  // initial progress
    this._buffer = 0;  // initial buffering
    this._totalLength = 0;  // line length when progress is 100%
    this._height = new Animated.Value(0);  // height of the progress or line width
    this._animatedLength = new Animated.Value(0);
    this._animatedBufferLength = new Animated.Value(0);
  }

  componentWillMount() {
    this.progress = this.props.progress;
    this.buffer = this.props.buffer;
  }

  componentWillReceiveProps(nextProps) {
    this.progress = nextProps.progress;
    this.buffer = nextProps.buffer;
  }

  // property initializers begin
  _onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (width > 0 && this._totalLength !== width) {
      this._totalLength = width;
      this._height.setValue(height);
      this._aniUpdateProgress(this.progress);
      this._aniUpdateBuffer(this.buffer);
    }
  };
  // property initializers end

  _aniUpdateProgress(theProgress) {
    if (!(this._totalLength > 0 && theProgress >= 0)) {
      return;
    }

    Animated.timing(this._animatedLength, {
      toValue: theProgress * this._totalLength,
      duration: this.props.progressAniDuration || 300,
      easing: Easing.out(Easing.quad),
    }).start();
  }

  _aniUpdateBuffer(buffer) {
    if (!(this._totalLength > 0 && buffer >= 0)) {
      return;
    }

    Animated.timing(this._animatedBufferLength, {
      toValue: buffer * this._totalLength,
      duration: this.props.bufferAniDuration || 200,
    }).start();
  }

  render() {
    const progressTheme = this.theme.progressStyle;
    const style = {
      backgroundColor: progressTheme.backgroundColor,
    };
    const bufferColor = this.props.bufferColor || progressTheme.bufferColor;
    const progressColor = this.props.progressColor || progressTheme.progressColor;

    return (
      <View  // the background layer
        ref="bg"
        style={[Progress.defaultProps.style, style, this.props.style]}
        onLayout={this._onLayout}
      >
        <Animated.View  // the buffering layer
          ref="bufferLayer"
          style={{
            position: 'absolute',
            backgroundColor: bufferColor,
            width: this._animatedBufferLength,
            height: this._height,
          }}
        />
        <Animated.View  // the forefront layer showing progress
          ref="progressLayer"
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
}

Object.defineProperty(Progress.prototype, 'progress', {
  // Update the current progress.
  // {`Number`} `value` the current progress, 0 ~ 1
  set(value) {
    if (value >= 0 && value !== this._progress) {
      this._progress = value;
      this._aniUpdateProgress(value);
    }
  },

  // Retrieve the current progress.
  get() {
    return this._progress;
  },

  enumerable: true,
});

Object.defineProperty(Progress.prototype, 'buffer', {
  // Update the current percent of buffering.
  // {`Number`} `value` current percent of buffering, 0 ~ 1
  set(value) {
    if (value >= 0 && value !== this._buffer) {
      this._buffer = value;
      this._aniUpdateBuffer(value);
    }
  },

  // Retrieve the current progress.
  get() {
    return this._buffer;
  },

  enumerable: true,
});


// ## Public interface
module.exports = Progress;
