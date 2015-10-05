//
// MDL style Spinner component.
//
// - @see [MDL Spinner](http://www.getmdl.io/components/index.html#loading-section/spinner)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/8/14.
//

const React = require('react-native');

const {
  Component,
  View,
  PropTypes,
  Animated,
  Platform,
} = React;

const MKColor = require('../MKColor');
const {getTheme} = require('../theme');

// controlling speed of rotation: percent to degree
const SPINNER_ROTATE_INTERP = {
  inputRange: [
    0, .125, .25, .375, .5, .625, .75, .875, 1,
  ],
  outputRange: [
    '0deg', '45deg', '90deg', '135deg', '180deg', '225deg', '270deg', '315deg', '360deg',
  ],
};

const L_ARC_ROTATE_INTERP = Platform.OS === 'android' ? {
  inputRange: [0, 0.5, 1],
  outputRange: ['170deg', '0deg', '170deg'],
} : {
  inputRange: [0, 0.5, 1],
  outputRange: ['130deg', '-5deg', '130deg'],
};

const R_ARC_ROTATE_INTERP = Platform.OS === 'android' ? {
  inputRange: [0, 0.5, 1],
  outputRange: ['-170deg', '0deg', '-170deg'],
} : {
  inputRange: [0, 0.5, 1],
  outputRange: ['-130deg', '5deg', '-130deg'],
};

// default stroke colors
const DEF_STROKE_COLORS = [
  'rgb(66,165,245)',  // mdl palette-blue-400
  'rgb(244,67,54)',   // mdl palette-red-500
  'rgb(253,216,53)',  // mdl palette-yellow-600
  'rgb(76,175,80)',   // mdl palette-green-500
];


//
// ## <section id='Spinner'>Spinner</section>
// The default `Spinner` component.
//
class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strokeColor: DEF_STROKE_COLORS[0],
      dimen: {},
    };
    this._strokeColorIndex = 0;
    this._animatedContainerAngle = new Animated.Value(0);
    this._animatedArcAngle = new Animated.Value(0);
    this._aniUpdateSpinner = this._aniUpdateSpinner.bind(this);
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      if (!this.refs.container) {
        return;
      }

      const container = this.refs.container.refs.node;  // un-box animated view
      container.measure((left, top, width, height) => {
        this.setState({dimen: {width, height}}, () => this._aniUpdateSpinner());
      });
    });
  }

  // rotation & arc animation
  _aniUpdateSpinner() {
    const duration = this.props.spinnerAniDuration || 1500;
    this._animatedContainerAngle.setValue(0);
    this._animatedArcAngle.setValue(0);

    this._updateStrokeColor(() => {
      Animated.parallel([
        Animated.timing(this._animatedContainerAngle, {
          duration,
          toValue: 1,
        }),
        Animated.timing(this._animatedArcAngle, {
          duration,
          toValue: 1,
        }),
      ]).start(() => setImmediate(this._aniUpdateSpinner));
    });
  }

  _renderSpinnerLayerAndroid(left) {
    const {width, height} = this.state.dimen;
    const radii = this.state.dimen.width / 2;
    const animBlockStyle = {
      width,
      height,
      position: 'absolute',
    };
    const clipperStyle = {
      height,
      width: radii,
      position: 'absolute',
      left: left ? 0 : radii,
      overflow: 'hidden',
    };
    const arcStyle = {
      width,
      height,
      position: 'absolute',
      borderRadius: radii,
      borderColor: this.state.strokeColor,
      borderWidth: this.props.strokeWidth || 3,
    };

    let arcInterpolate;
    if (left) {
      arcInterpolate = L_ARC_ROTATE_INTERP;
      animBlockStyle.transform = [
        {rotate: this._animatedArcAngle.interpolate(arcInterpolate)},
      ];
    } else {
      arcStyle.right = 0;
      animBlockStyle.right = 0;
      arcInterpolate = R_ARC_ROTATE_INTERP;
      animBlockStyle.transform = [
        {rotate: this._animatedArcAngle.interpolate(arcInterpolate)},
      ];
    }

    // FIXME Android doesn't respect borderXxxColor for circles,
    // so I have to clip it to semi-circle using view hierarchies
    // @see https://github.com/facebook/react-native/issues/3235
    return (
      <View style={{  // the container
              height,
              width: radii,
              overflow: 'hidden',
              position: 'absolute',
              left: left ? 0 : radii,
            }}
        >
        <Animated.View style={animBlockStyle}>
          <View style={clipperStyle}>
            <View style={arcStyle} />
          </View>
        </Animated.View>
      </View>
    );
  }

  _renderSpinnerLayerIOS(left) {
    const {width, height} = this.state.dimen;
    const radii = this.state.dimen.width / 2;
    const arcStyle = {
      width,
      height,
      position: 'absolute',
      borderColor: this.state.strokeColor,
      borderBottomColor: MKColor.Transparent,
      borderRadius: radii,
      borderWidth: this.props.strokeWidth || 3,
    };

    let arcInterpolate;
    if (left) {
      arcInterpolate = L_ARC_ROTATE_INTERP;
      arcStyle.borderRightColor = MKColor.Transparent;
      arcStyle.transform = [
        {rotate: this._animatedArcAngle.interpolate(arcInterpolate)},
      ];
    } else {
      arcInterpolate = R_ARC_ROTATE_INTERP;
      arcStyle.right = 0;
      arcStyle.borderLeftColor = MKColor.Transparent;
      arcStyle.transform = [
        {rotate: this._animatedArcAngle.interpolate(arcInterpolate)},
      ];
    }

    return (
      <View style={{  // the clipper layer
              height,
              width: radii,
              overflow: 'hidden',
              position: 'absolute',
              left: left ? 0 : radii,
            }}
        >
        <Animated.View  // the arc
          style={arcStyle}
          />
      </View>
    );
  }

  // render the specified part (left or right) of the arc
  _renderSpinnerLayer(left) {
    return Platform.OS === 'android' ? this._renderSpinnerLayerAndroid(left) :
      this._renderSpinnerLayerIOS(left);
  }

  _updateStrokeColor(cb) {
    const colors = this.props.strokeColor;
    let nextColor;

    if (Array.isArray(colors)) {
      const nextColorIndex = this._strokeColorIndex % colors.length || 0;
      this._strokeColorIndex += 1;
      nextColor = colors[nextColorIndex];
    } else {
      nextColor = colors;
    }

    this.setState({strokeColor: nextColor || DEF_STROKE_COLORS[0]}, cb);
  }

  render() {
    return (
        <Animated.View  // the container layer
          ref="container"
          style={[{
              transform: [
                {rotate: this._animatedContainerAngle.interpolate(SPINNER_ROTATE_INTERP)},
              ],
            },
            Spinner.defaultProps.style,
            this.props.style,
          ]}
          >
          {this._renderSpinnerLayer(true)  /* spinner-left */}
          {this._renderSpinnerLayer(false)  /* spinner-right */}
        </Animated.View>
    );
  }
}

// ## <section id='props'>Props</section>
Spinner.propTypes = {
  // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Colors of the progress stroke
  // - {`Array`|`String`} can be a list of colors
  // or a single one
  strokeColor: PropTypes.any,

  // Width of the progress stroke
  strokeWidth: PropTypes.number,

  // Duration of the spinner animation, in milliseconds
  spinnerAniDuration: PropTypes.number,
};

// ## <section id='defaults'>Defaults</section>
Spinner.defaultProps = {
  strokeWidth: 3,
  strokeColor: DEF_STROKE_COLORS,
  spinnerAniDuration: 1333,
  style: {
    width: 28,
    height: 28,
  },
};


// --------------------------
// Builder
//
const {
  Builder,
} = require('../builder');

//
// ## Spinner builder
//
class SpinnerBuilder extends Builder {
  build() {
    const BuiltSpinner = class extends Spinner {};
    BuiltSpinner.defaultProps = Object.assign({}, Spinner.defaultProps, this.toProps());
    return BuiltSpinner;
  }
}

// define builder method for each prop
SpinnerBuilder.defineProps(Spinner.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//
function spinner() {
  return new SpinnerBuilder().withBackgroundColor(MKColor.Transparent);
}

function singleColorSpinner() {
  return spinner().withStrokeColor(getTheme().primaryColor);
}


// ## Public interface
module.exports = Spinner;
Spinner.Builder = SpinnerBuilder;
Spinner.spinner = spinner;
Spinner.singleColorSpinner = singleColorSpinner;
