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
const MKTouchable = require('../internal/MKTouchable');

const {
  Component,
  Animated,
  View,
  PropTypes,
  Platform,
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

    // [Android] set initial size > 0 to avoid NPE at `ReactViewBackgroundDrawable.drawRoundedBackgroun`
    // @see https://github.com/facebook/react-native/issues/3069
    this.state = {
      width: 1,
      height: 1,
      maskBorderRadius: 0,
      shadowOffsetY: 1,
      ripple: {radii: 0, dia: 0, offset: {top: 0, left: 0}},
    };
  }

  // Touch events handling
  _onTouchEvent(evt) {
    switch (evt.type) {
      case 'TOUCH_DOWN':
        this._onPointerDown(evt);
        break;
      case 'TOUCH_UP':
      case 'TOUCH_CANCEL':
        this._onPointerUp();
        break;
    }

    if (this.props.onTouch) {
      this.props.onTouch(evt);
    }
  }

  measure(cb) {
    return this.refs.container.measure(cb);
  }

  _onLayout(evt) {
    this._onLayoutChange(evt.nativeEvent.layout);

    if (this.props.onLayout) {
      this.props.onLayout(evt);
    }
  }

  _onLayoutChange({width, height}) {
    if (width === this.state.width && height === this.state.height) {
      return;
    }

    this.setState({
      width,
      height,
      ...this._calcMaskLayer(width, height),
    });
  }

  // update Mask layer's dimen
  _calcMaskLayer(width, height) {
    const maskRadiiPercent = this.props.maskBorderRadiusInPercent;
    let maskBorderRadius = this.props.maskBorderRadius;

    if (maskRadiiPercent) {
      maskBorderRadius = Math.min(width, height) * maskRadiiPercent / 100;
    }

    return {maskBorderRadius};
  }

  // update Ripple layer's dimen
  _calcRippleLayer(x0, y0) {
    const {width, height, maskBorderRadius} = this.state;
    const {maskBorderRadiusInPercent} = this.props;
    let offsetX, offsetY, radii, hotSpotX = x0, hotSpotY = y0;

    if (this.props.rippleLocation === 'center') {
      hotSpotX = width / 2;
      hotSpotY = height / 2;
    }
    offsetX = Math.max(hotSpotX, (width - hotSpotX));
    offsetY = Math.max(hotSpotY, (height - hotSpotY));

    // FIXME Workaround for Android not respect `overflow`
    // @see https://github.com/facebook/react-native/issues/3198
    if (Platform.OS === 'android'
        && this.props.rippleLocation === 'center'
        && this.props.maskEnabled && maskBorderRadiusInPercent > 0) {
      // limit ripple to the bounds of mask
      radii = maskBorderRadius;
    } else {
      radii = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    }

    return {
      ripple: {
        radii,
        dia: radii * 2,
        offset: {
          top: hotSpotY - radii,
          left: hotSpotX - radii,
        },
      },
    };
  }

  _onPointerDown(evt) {
    this.setState({
      ...this._calcRippleLayer(evt.x, evt.y),
    });
    this.showRipple();
  }

  _onPointerUp() {
    this.hideRipple();
  }

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
      this.setState({shadowOffsetY: 1.5});
    }

    this._rippleAni.start(() => {
      this._rippleAni = undefined;

      // if any pending animation, do it
      if (this._pendingRippleAni) {
        this._pendingRippleAni();
      }
    });
  }

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
        this.setState({shadowOffsetY: 1});
      }

      this._pendingRippleAni = undefined;
    };

    if (!this._rippleAni) {
      // previous ripple animation is done, good to go
      this._pendingRippleAni();
    }
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
      <MKTouchable ref="container"
                   {...this.props}
                   style={[this.props.style, shadowStyle]}
                   onTouch={this._onTouchEvent.bind(this)}
                   onLayout={this._onLayout.bind(this)}
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
            borderRadius: this.state.maskBorderRadius,
            overflow: this.props.maskEnabled ? 'hidden' : 'visible',
          }}
          >
          <Animated.View
            ref="rippleLayer"
            style={{
              // position: 'absolute',
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
      </MKTouchable>
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

  // Border radius of the `Mask` layer, in percentage (of min(width, height))
  maskBorderRadiusInPercent: PropTypes.number,

  // Duration of the mask effect (alpha), in milliseconds
  maskDuration: PropTypes.number,

  // Animating the shadow (on pressed/released) or not
  shadowAniEnabled: PropTypes.bool,

  // Touch events callback
  onTouch: React.PropTypes.func,

  onLayout: React.PropTypes.func,
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
