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
    this._nextStrokeColorIndex = 0;
    this._animatedContainerAngle = new Animated.Value(0);
    this._animatedArcAngle = new Animated.Value(0);
    this._aniUpdateSpinner = this._aniUpdateSpinner.bind(this);
  }

  _onLayout({nativeEvent: {layout: {width, height}}}) {
    if (width > 0 && this.state.width !== width) {
      this.setState({dimen: {width, height}}, this._aniUpdateSpinner);
    }
  }

  // rotation & arc animation
  _aniUpdateSpinner() {
    const {width, height} = this.state.dimen;
    if (!width || !height) {
      return;
    }

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
      ]).start(({finished}) => finished && setImmediate(this._aniUpdateSpinner));
    });
  }

  // render the specified part (left or right) of the arc
  _renderSpinnerLayer(left) {
    const {width, height} = this.state.dimen;
    const radii = width / 2;
    const arcStyle = {
      width,
      height,
      position: 'absolute',
      borderColor: this.state.strokeColor,
      borderBottomColor: MKColor.Transparent,
      borderRadius: radii,
      borderWidth: this.props.strokeWidth || 3,
    };

    if (!width || !height) {
      return;
    }

    let arcInterpolate;
    if (left) {
      arcInterpolate = L_ARC_ROTATE_INTERP;
      arcStyle.borderRightColor = MKColor.Transparent;
    } else {
      arcInterpolate = R_ARC_ROTATE_INTERP;
      arcStyle.right = 0;
      arcStyle.borderLeftColor = MKColor.Transparent;
    }

    arcStyle.transform = [
      {rotate: this._animatedArcAngle.interpolate(arcInterpolate)},
    ];

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

  _updateStrokeColor(cb) {
    const colors = this.props.strokeColor;
    let nextColor;

    if (Array.isArray(colors)) {
      const index = this._nextStrokeColorIndex % colors.length || 0;
      this._nextStrokeColorIndex = index + 1;
      nextColor = colors[index];
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
          onLayout={this._onLayout.bind(this)}
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
