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
} = React;

const MKColor = require('../MKColor');
const utils = require('../utils');

//
// ## <section id='Progress'>Progress</section>
// The default `Progress` component.
//
class Progress extends Component {
  constructor(props) {
    super(props);
    this._progress = 0;  // initial progress
    this._totalLength = 0;  // line length when progress is 100%
    this._height = new Animated.Value(0);  // height of the progress or line width
    this._animatedLength = new Animated.Value(0);
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

  componentWillMount() {
    this.progress = this.props.progress;
  }

  componentWillReceiveProps(nextProps) {
    this.progress = nextProps.progress;
  }

  componentDidMount() {
    requestAnimationFrame(this._doMeasurement.bind(this));
  }

  _doMeasurement() {
    this.refs.bg.measure(this._onMeasured.bind(this));
  }

  _onMeasured(left, top, width, height) {
    this._totalLength = width;
    this._height.setValue(height);
    this._aniUpdateProgress(this.progress);
  }

  _aniUpdateProgress(progress) {
    if (this._totalLength <= 0) {
      return;
    }

    Animated.timing(this._animatedLength, {
      toValue: progress * this._totalLength,
      duration: this.props.progressAniDuration || 300,
    }).start();
  }

  render() {
    return (
      <View  // the background layer
        ref="bg"
        style={[Progress.defaultProps.style, this.props.style]}
        >
        <Animated.View  // the forefront layer showing progress
          ref="progressLayer"
          style={{
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

  // Duration of the progress animation, in milliseconds
  progressAniDuration: PropTypes.number,
};

// ## <section id='defaults'>Defaults</section>
Progress.defaultProps = {
  progressColor: MKColor.Indigo,
  style: {
    backgroundColor: `rgba(${MKColor.RGBIndigo},0.3)`,
    height: utils.toPixels(2),
  },
};


// ## Public interface
module.exports = Progress;
