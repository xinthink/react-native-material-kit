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
} = React;

const MKColor = require('../MKColor');
const {getTheme} = require('../theme');
const utils = require('../utils');

// controlling speed of rotation: percent to degree
const spinnerRotationInterpolate = {
  inputRange: [
    0, .125, .25, .375, .5, .625, .75, .875, 1,
  ],
  outputRange: [
    '0deg', '45deg', '90deg', '135deg', '180deg', '225deg', '270deg', '315deg', '360deg',
  ],
};

// default stroke colors
const defaultStrokeColors = [
  'rgb(66,165,245)',  //palette-blue-400
  'rgb(244,67,54)',   //palette-red-500
  'rgb(253,216,53)',  //palette-yellow-600
  'rgb(76,175,80)',   //palette-green-500
];


//
// ## <section id='Spinner'>Spinner</section>
// The default `Spinner` component.
//
class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strokeColor: defaultStrokeColors[0],
      dimen: {},
    };
    this._strokeColorIndex = 0;
    this._animatedContainerAngle = new Animated.Value(0);
    this._animatedArcAngle = new Animated.Value(0);
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.refs.container.refs.node.measure((left, top, width, height) => {
        this.setState({dimen: {width, height}}, () => this._aniUpdateSpinner());
      });
    });
  }

  // rotation & arc animation
  _aniUpdateSpinner() {
    this._updateStrokeColor(() => {
      this._animatedContainerAngle.setValue(0);
      this._animatedArcAngle.setValue(0);
      Animated.parallel([
        Animated.timing(this._animatedContainerAngle, {
          toValue: 1,
          duration: this.props.spinnerAniDuration || 1500,
        }),
        Animated.timing(this._animatedArcAngle, {
          toValue: 1,
          duration: this.props.spinnerAniDuration || 1500,
        }),
      ]).start(() => this._aniUpdateSpinner());
    });
  }

  // render the specified part (left or right) of the arc
  _renderSpinnerLayer(left) {
    const radii = this.state.dimen.width / 2;
    const arcStyle = {
      position: 'absolute',
      width: this.state.dimen.width,
      height: this.state.dimen.height,
      borderColor: this.state.strokeColor,
      borderBottomColor: MKColor.Transparent,
      borderRadius: radii,
      borderWidth: this.props.strokeWidth || 3,
    };

    if (left) {
      arcStyle.borderRightColor = MKColor.Transparent;
      arcStyle.transform = [
        {rotate: this._animatedArcAngle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['130deg', '-5deg', '130deg'],
        })},
      ];
    } else {
      arcStyle.right = 0;
      arcStyle.borderLeftColor = MKColor.Transparent;
      arcStyle.transform = [
        {rotate: this._animatedArcAngle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: ['-130deg', '5deg', '-130deg'],
        })},
      ];
    }

    return (
      <View style={{  // the clipper layer
              width: radii,
              height: this.state.dimen.height,
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
      const nextColorIndex = this._strokeColorIndex % colors.length || 0;
      this._strokeColorIndex += 1;
      nextColor = colors[nextColorIndex];
    } else {
      nextColor = colors;
    }

    this.setState({strokeColor: nextColor || defaultStrokeColors[0]}, cb);
  }

  render() {
    return (
        <Animated.View  // the container layer
          ref="container"
          style={[{
              transform: [
                {rotate: this._animatedContainerAngle.interpolate(spinnerRotationInterpolate)},
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
  strokeWidth: utils.toPixels(1.5),
  strokeColor: defaultStrokeColors,
  spinnerAniDuration: 1500,
  style: {
    width: utils.toPixels(14),
    height: utils.toPixels(14),
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
  return new SpinnerBuilder();
}

function singleColorSpinner() {
  return spinner().withStrokeColor(getTheme().primaryColor);
}


// ## Public interface
module.exports = Spinner;
Spinner.Builder = SpinnerBuilder;
Spinner.spinner = spinner;
Spinner.singleColorSpinner = singleColorSpinner;
