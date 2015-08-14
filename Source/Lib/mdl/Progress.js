//
// MDL style progress bar component.
//
// - @see [MDL Progress Bar](http://www.getmdl.io/components/index.html#loading-section/progress)
// - [Props](#props)
// - [Defaults](#defaults)
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
const utils = require('../utils');

//
// ## <section id='Progress'>Progress</section>
// The default `Progress` component, with a simplified buffering effect.
//
class Progress extends Component {
  constructor(props) {
    super(props);
    this._progress = 0;  // initial progress
    this._buffer = 0;  // initial buffering
    this._totalLength = 0;  // line length when progress is 100%
    this._height = new Animated.Value(0);  // height of the progress or line width
    this._animatedLength = new Animated.Value(0);
    this._animatedBufferLength = new Animated.Value(0);
  }

  // Update the current progress.
  // {`Number`} `progress` the current progress, 0 ~ 1
  set progress(progress) {
    this._progress = progress;
    this._aniUpdateProgress(progress);
  }

  // Retrieve the current progress.
  get progress() {
    return this._progress;
  }

  // Update the current percent of buffering.
  // {`Number`} `buffer` current percent of buffering, 0 ~ 1
  set buffer(buffer) {
    this._buffer = buffer;
    this._aniUpdateBuffer(buffer);
  }

  // Retrieve the current progress.
  get buffer() {
    return this._buffer;
  }

  componentWillMount() {
    this.progress = this.props.progress;
    this.buffer = this.props.buffer;
  }

  componentWillReceiveProps(nextProps) {
    this.progress = nextProps.progress;
    this.buffer = nextProps.buffer;
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.refs.bg.measure((left, top, width, height) => {
        this._totalLength = width;
        this._height.setValue(height);
        this._aniUpdateProgress(this.progress);
        this._aniUpdateBuffer(this.buffer);
      });
    });
  }

  _aniUpdateProgress(progress) {
    if (this._totalLength <= 0) {
      return;
    }

    Animated.timing(this._animatedLength, {
      toValue: progress * this._totalLength,
      duration: this.props.progressAniDuration || 300,
      easing: Easing.quad,
    }).start();
  }

  _aniUpdateBuffer(buffer) {
    if (this._totalLength <= 0) {
      return;
    }

    Animated.timing(this._animatedBufferLength, {
      toValue: buffer * this._totalLength,
      duration: this.props.bufferAniDuration || 200,
    }).start();
  }

  render() {
    return (
      <View  // the background layer
        ref="bg"
        style={[Progress.defaultProps.style, this.props.style]}
        >
        <Animated.View  // the buffering layer
          ref="bufferLayer"
          style={{
            position: 'absolute',
            backgroundColor: this.props.bufferColor,
            width: this._animatedBufferLength,
            height: this._height,
          }}
          />
        <Animated.View  // the forefront layer showing progress
          ref="progressLayer"
          style={{
            position: 'absolute',
            backgroundColor: this.props.progressColor,
            width: this._animatedLength,
            height: this._height,
          }}
          />
      </View>
    );
  }
}

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
  progressColor: MKColor.Indigo,
  bufferColor: `rgba(${MKColor.RGBIndigo},0.3)`,
  style: {
    backgroundColor: `rgba(${MKColor.RGBIndigo},0.3)`,
    height: utils.toPixels(2),
  },
};

//
// ## <section id='IndeterminateProgress'>IndeterminateProgress</section>
// Progress Bar with Indeterminate Progress.
//
class IndeterminateProgress extends Component {
  constructor(props) {
    super(props);
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
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.refs.bg.measure((left, top, width, height) => {
        this._totalLength = width;
        this._height.setValue(height);
        this._aniUpdateProgress();
      });
    });
  }

  _aniUpdateProgress() {
    if (this._totalLength <= 0) {
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
          easing: Easing.quad,
        }),
        this._getBlock2Ani(),
      ]),
    ]).start(() => {
      this._aniUpdateProgress();
    });
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
          easing: Easing.quad,
        }),
        Animated.timing(this._animatedBlock2.right, {
          toValue: 0,
          duration: this.props.progressAniDuration || 700,
          easing: Easing.quad,
        }),
      ]),
    ]);
  }

  render() {
    return (
      <View  // the background layer
        ref="bg"
        style={[Progress.defaultProps.style, this.props.style]}
        >
        <Animated.View  // the 1st animated progress block
          style={{
            backgroundColor: this.props.progressColor,
            position: 'absolute',
            left: this._animatedBlock1.left,
            right: this._animatedBlock1.right,
            height: this._height,
          }}
          />
        <Animated.View  // the 2nd animated progress block
          style={{
            backgroundColor: this.props.progressColor,
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
  progressColor: MKColor.Indigo,
  style: {
    backgroundColor: `rgba(${MKColor.RGBIndigo},0.3)`,
    height: utils.toPixels(2),
  },
};


// ## Public interface
module.exports = Progress;
Progress.Indeterminate = IndeterminateProgress;
