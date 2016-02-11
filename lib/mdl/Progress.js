//
// MDL style progress bar component.
//
// - @see [MDL Progress Bar](http://www.getmdl.io/components/index.html#loading-section/progress)
//
// - [Default progress](#Progress)
//   - [Props](#props)
//   - [Defaults](#defaults)
//
// - [Indeterminate progress](#IndeterminateProgress)
//   - [Props](#IndeterminateProgressProps)
//   - [Defaults](#IndeterminateProgressDefaults)
//
// Created by ywu on 15/8/7.
//

const React = require('react-native');

const {
  Component,
  View,
  PropTypes,
  Animated,
  Easing,
} = React;

const MKColor = require('../MKColor');
import {getTheme} from '../theme';

//
// ## <section id='Progress'>Progress</section>
// The default `Progress` component, with a simplified buffering effect.
//
class Progress extends Component {
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

  _onLayout({nativeEvent: {layout: {width, height}}}) {
    if (width > 0 && this._totalLength !== width) {
      this._totalLength = width;
      this._height.setValue(height);
      this._aniUpdateProgress(this.progress);
      this._aniUpdateBuffer(this.buffer);
    }
  }

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
        onLayout={this._onLayout.bind(this)}
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
  set: function (progress) {
    if (progress >= 0 && progress !== this._progress) {
      this._progress = progress;
      this._aniUpdateProgress(progress);
    }
  },
  // Retrieve the current progress.
  get: function () {
    return this._progress;
  },
  enumerable: true,
});

Object.defineProperty(Progress.prototype, 'buffer', {
  // Update the current percent of buffering.
  // {`Number`} `buffer` current percent of buffering, 0 ~ 1
  set: function (buffer) {
    if (buffer >= 0 && buffer !== this._buffer) {
      this._buffer = buffer;
      this._aniUpdateBuffer(buffer);
    }
  },
  // Retrieve the current progress.
  get: function () {
    return this._buffer;
  },
  enumerable: true,
});

// ## <section id='props'>Props</section>
Progress.propTypes = {
  // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Initial value of progress, Number: [0, 1.0]
  progress: PropTypes.number,

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
Progress.defaultProps = {
  style: {
    height: 4,
  },
};

//
// ## <section id='IndeterminateProgress'>IndeterminateProgress</section>
// Progress Bar with Indeterminate Progress.
//
class IndeterminateProgress extends Component {
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

  _onLayout({nativeEvent: {layout: {width, height}}}) {
    if (width > 0 && this._totalLength !== width) {
      this._totalLength = width;
      this._height.setValue(height);
      this._aniUpdateProgress();
    }
  }

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
    ]).start(({finished}) => finished && setImmediate(this._aniUpdateProgress));
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
        style={[Progress.defaultProps.style, style, this.props.style]}
        onLayout={this._onLayout.bind(this)}
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

// ## <section id='IndeterminateProgressProps'>Props</section>
IndeterminateProgress.propTypes = {
  // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Color of the progress layer
  progressColor: PropTypes.string,
};

// ## <section id='IndeterminateProgressDefaults'>Defaults</section>
IndeterminateProgress.defaultProps = {
  style: Progress.defaultProps.style,
};


// --------------------------
// Builder
//
const {
  Builder,
} = require('../builder');

//
// ## Progress builder
//
class ProgressBuilder extends Builder {
  withIndeterminate(isIndeterminate) {
    this.indeterminate = isIndeterminate;
    return this;
  }

  build() {
    const BuiltProgress = this.indeterminate ?
      class extends IndeterminateProgress {} : class extends Progress {};
    const defaults = (this.indeterminate ? IndeterminateProgress : Progress).defaultProps;
    BuiltProgress.defaultProps = Object.assign({}, defaults, this.toProps());
    return BuiltProgress;
  }
}

// define builder method for each prop
ProgressBuilder.defineProps(Progress.propTypes);
ProgressBuilder.defineProps(IndeterminateProgress.propTypes);

// ----------
// ## <section id="builders">Built-in builders</section>
//
function progress() {
  return new ProgressBuilder()
    .withBackgroundColor(getTheme().progressStyle.backgroundColor);
}

function indeterminateProgress() {
  return progress().withIndeterminate(true);
}


// ## Public interface
module.exports = Progress;
Progress.Indeterminate = IndeterminateProgress;
Progress.Builder = ProgressBuilder;
Progress.progress = progress;
Progress.indeterminateProgress = indeterminateProgress;
