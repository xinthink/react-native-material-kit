//
// Reusable Ripple layout
//
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/8/2.
//
const React = require('react-native');
const MKPropTypes = require('../MKPropTypes');
const {toPixels} = require('../utils');

const {
  Component,
  Animated,
  View,
  PropTypes,
} = React;

//
// ## <section id='Ripple'>Ripple</section>
// Reusable `Ripple` effect.
//
class Ripple extends Component {
  constructor(props) {
    super(props);
    this._animatedAlpha = new Animated.Value(0);
    this._animatedRippleScale = new Animated.Value(0);
    this.state = {
      width: 0,
      height: 0,
      shadowOffsetY: toPixels(.5),
      ripple: {radii: 0, dia: 0, offset: {top: 0, left: 0}},
    };
  }

  // The View is now responding for touch events.
  onResponderGrant(evt) {
    this._onPointerDown(evt);
  }

  // Something else is the responder right now and will not release it
  onResponderReject(evt) {
    this._onPointerUp(evt);
  }

  // The user is moving their finger
  onResponderMove(evt) {
    //this._onPointerDown(evt);
  }

  // Fired at the end of the touch, ie "touchUp"
  onResponderRelease(evt) {
    this._onPointerUp(evt);
  }

  // The responder has been taken from the View.
  onResponderTerminate(evt) {
    this._onPointerUp(evt);
  }

  componentDidMount() {
    requestAnimationFrame(this._doMeasurement.bind(this));
  }

  measure(cb) {
    return this.refs.container.measure(cb);
  }

  _doMeasurement() {
    this.measure((x, y, width, height) => {
      this.setState({
        width,
        height,
        ripple: this._calcRippleLayer(width / 2, height / 2, width, height),
      });
    });
  }

  _calcRippleLayer(x0, y0, width, height) {
    let hotSpotX = x0, hotSpotY = y0;
    if (this.props.rippleLocation === 'center') {
      hotSpotX = width / 2;
      hotSpotY = height / 2;
    }

    const offsetX = Math.max(hotSpotX, (width - hotSpotX));
    const offsetY = Math.max(hotSpotY, (height - hotSpotY));
    const radii = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    const dia = radii * 2;

    return {
      radii,
      dia,
      offset: {
        top: hotSpotY - radii,
        left: hotSpotX - radii,
      },
    };
  }

  _onPointerDown(evt) {
    this.setState({
      ripple: this._calcRippleLayer(evt.nativeEvent.locationX,
        evt.nativeEvent.locationY,
        this.state.width,
        this.state.height),
    });
    this.showRipple();
  }

  _onPointerUp() {
    this.hideRipple();
  }

  //  ## <section id='showRipple'>showRipple</section>
  // Start the ripple effect
  showRipple() {
    this._animatedAlpha.setValue(1);
    this._animatedRippleScale.setValue(.3);

    // scaling up the ripple layer
    this._rippleAni = Animated.timing(this._animatedRippleScale, {
      toValue: 1,
      duration: this.props.rippleDuration || 200,
    });

    // enlarge the shadow, if enabled
    if (this.props.shadowAniEnabled) {
      this.setState({shadowOffsetY: toPixels(1)});
    }

    this._rippleAni.start(() => {
      this._rippleAni = undefined;

      // if any pending animation, do it
      if (this._pendingRippleAni) {
        this._pendingRippleAni();
      }
    });
  }

  //  ## <section id='hideRipple'>hideRipple</section>
  // Stop the ripple effect
  hideRipple() {
    this._pendingRippleAni = () => {
      // hide the ripple layer
      Animated.timing(this._animatedAlpha, {
        toValue: 0,
        duration: this.props.maskDuration || 200,
      }).start();

      // scale down the shadow
      if (this.props.shadowAniEnabled) {
        this.setState({shadowOffsetY: toPixels(.5)});
      }

      this._pendingRippleAni = undefined;
    };

    if (!this._rippleAni) {
      // previous ripple animation is done, good to go
      this._pendingRippleAni();
    }
  }

  _wrapResponderHandler(handler) {
    return this.props.interceptPointerEvents ? handler.bind(this) : undefined;
  }

  render() {
    const shadowStyle = {};
    if (this.props.shadowAniEnabled) {
      shadowStyle.shadowOffset = {
        width: 0,
        height: this.state.shadowOffsetY,
      };
    }

    return (
      <View ref="container"
            style={[this.props.style, shadowStyle]}
            pointerEvents={this.props.interceptPointerEvents ? 'box-only' : 'box-none'}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => false}
            onResponderGrant={this._wrapResponderHandler(this.onResponderGrant)}
            onResponderReject={this._wrapResponderHandler(this.onResponderReject)}
            onResponderMove={this._wrapResponderHandler(this.onResponderMove)}
            onResponderRelease={this._wrapResponderHandler(this.onResponderRelease)}
            onResponderTerminationRequest={() => true}
            onResponderTerminate={this._wrapResponderHandler(this.onResponderTerminate)}
        >
        {this.props.children}
        <Animated.View
          ref="maskLayer"
          style={{
            position: 'absolute',
            backgroundColor: this.props.maskColor,
            opacity: this._animatedAlpha,
            top: 0,
            left: 0,
            width: this.state.width,
            height: this.state.height,
            borderRadius: this.props.maskBorderRadius,
            overflow: this.props.maskEnabled ? 'hidden' : 'visible',
          }}
          >
          <Animated.View
            ref="rippleLayer"
            style={{
              position: 'absolute',
              backgroundColor: this.props.rippleColor,
              width: this.state.ripple.dia,
              height: this.state.ripple.dia,
              ...this.state.ripple.offset,
              borderRadius: this.state.ripple.radii,
              transform: [
                {scale: this._animatedRippleScale},
              ],
            }}
            />
        </Animated.View>
      </View>
    );
  }
}

// ## <section id='props'>Props</section>
Ripple.propTypes = {
  // [RN.View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Color of the `Ripple` layer
  rippleColor: PropTypes.string,

  // Duration of the ripple effect, in milliseconds
  rippleDuration: PropTypes.number,

  // Hot-spot position of the ripple effect, [available values](../MKPropTypes.html#rippleLocation)
  rippleLocation: MKPropTypes.rippleLocation,

  // Whether a `Mask` layer should be used, to clip the ripple to the container’s bounds,
  // default is `true`
  maskEnabled: PropTypes.bool,

  // Color of the `Mask` layer
  maskColor: PropTypes.string,

  // Border radius of the `Mask` layer
  maskBorderRadius: PropTypes.number,

  // Duration of the mask effect (alpha), in milliseconds
  maskDuration: PropTypes.number,

  // Animating the shadow (on pressed/released) or not
  shadowAniEnabled
:
PropTypes.bool,

  // Whether the `Ripple` layout should intercept the pointer events, to enable the ripple effect,
  // if the child views should be the responders, you must popgate the events to the `Ripple` layout, by invoking the [responder lifecycle methods](https://facebook.github.io/react-native/docs/gesture-responder-system.html#responder-lifecycle)
  // or `[showRipple](#showRipple)` and `[hideRipple](#hideRipple)` methods manually,
  // default to `true`
  interceptPointerEvents: PropTypes.bool,
};

// ## <section id='defaults'>Defaults</section>
Ripple.defaultProps = {
  rippleColor: 'rgba(255,255,255,0.2)',
  rippleDuration: 200,
  rippleLocation: 'tapLocation',
  maskEnabled: true,
  maskColor: 'rgba(255,255,255,0.15)',
  maskBorderRadius: 2,
  maskDuration: 200,
  shadowAniEnabled: true,
  interceptPointerEvents: true,
};


// --------------------------
// Builder
//
const {Builder} = require('../builder');

//
// ## Ripple builder
// - @see [Builder](../builder.html#Builder)
//
class RippleBuilder extends Builder {
  build() {
    const BuiltRipple = class extends Ripple {};
    BuiltRipple.defaultProps = Object.assign({}, Ripple.defaultProps, this.toProps());
    return BuiltRipple;
  }
}

// define builder method for each prop
RippleBuilder.defineProps(Ripple.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//
function ripple() {
  return new RippleBuilder();
}


// ## Public interface
module.exports = Ripple;
Ripple.Builder = RippleBuilder;
Ripple.ripple = ripple;
