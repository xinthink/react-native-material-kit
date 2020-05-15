/**
 * Reusable Ripple layout
 *
 * Created by ywu on 15/8/2.
 */
import React, { Component, createRef } from 'react';
import { Animated, findNodeHandle, NativeModules, Platform, } from 'react-native';
import MKTouchable from '../internal/MKTouchable';
const UIManager = NativeModules.UIManager;
/** Default props of {@link Ripple} */
const defaultProps = {
    borderWidth: 0,
    disabled: false,
    maskBorderRadius: 2,
    maskBorderRadiusInPercent: 0,
    maskColor: 'rgba(255, 255, 255, 0.15)',
    maskDuration: 200,
    maskEnabled: true,
    rippleColor: 'rgba(255, 255, 255, 0.2)',
    rippleDuration: 200,
    rippleLocation: 'tapLocation',
    shadowAniEnabled: true,
};
/**
 * Reusable `Ripple` effect.
 */
export default class Ripple extends Component {
    constructor(props) {
        super(props);
        this.containerRef = createRef();
        this.maskRef = createRef();
        this.rippleRef = createRef();
        this._animatedAlpha = new Animated.Value(0);
        this._animatedRippleScale = new Animated.Value(0);
        this._onLayout = (evt) => {
            this._onLayoutChange(evt.nativeEvent.layout);
            this.props.onLayout && this.props.onLayout(evt);
        };
        // Touch events handling
        this._onTouchEvent = (evt) => {
            if (this.props.disabled) {
                return;
            }
            switch (evt.type) {
                case 'TOUCH_DOWN':
                    this._onPointerDown(evt);
                    break;
                case 'TOUCH_UP':
                case 'TOUCH_CANCEL':
                    this._onPointerUp();
                    break;
                default:
                    break;
            }
            if (this.props.onTouch) {
                this.props.onTouch(evt);
            }
        };
        // [Android] set initial size > 0 to avoid NPE
        // at `ReactViewBackgroundDrawable.drawRoundedBackgroundWithBorders`
        // @see https://github.com/facebook/react-native/issues/3069
        this.state = {
            height: 1,
            width: 1,
            maskBorderRadius: 0,
            ripple: { radii: 0, dia: 0, offset: { top: 0, left: 0 } },
            shadowOffsetY: 1,
        };
    }
    /**
     * Measure the size of the `Ripple`.
     * @param cb {@link MeasureOnSuccessCallback | measurement callback}
     */
    measure(cb) {
        // eslint-disable-next-line prettier/prettier
        return this.containerRef.current && UIManager.measure(findNodeHandle(this.containerRef.current) || 0, cb);
    }
    /** Start the ripple effect */
    showRipple() {
        this._animatedAlpha.setValue(1);
        this._animatedRippleScale.setValue(0.3);
        // scaling up the ripple layer
        this._rippleAni = Animated.timing(this._animatedRippleScale, {
            duration: this.props.rippleDuration || 200,
            toValue: 1,
            useNativeDriver: true,
        });
        // enlarge the shadow, if enabled
        if (this.props.shadowAniEnabled) {
            this.setState({ shadowOffsetY: 1.5 });
        }
        this._rippleAni.start(() => {
            this._rippleAni = undefined;
            // if any pending animation, do it
            if (this._pendingRippleAni) {
                this._pendingRippleAni();
            }
        });
    }
    /** Stop the ripple effect */
    hideRipple() {
        this._pendingRippleAni = () => {
            // hide the ripple layer
            Animated.timing(this._animatedAlpha, {
                duration: this.props.maskDuration || 200,
                toValue: 0,
                useNativeDriver: true,
            }).start();
            // scale down the shadow
            if (this.props.shadowAniEnabled) {
                this.setState({ shadowOffsetY: 1 });
            }
            this._pendingRippleAni = undefined;
        };
        if (!this._rippleAni) {
            // previous ripple animation is done, good to go
            this._pendingRippleAni();
        }
    }
    /** {@inheritDoc @types/react#Component.render} */
    render() {
        const shadowStyle = {};
        if (this.props.shadowAniEnabled) {
            shadowStyle.shadowOffset = {
                height: this.state.shadowOffsetY,
                width: 0,
            };
        }
        return (<MKTouchable ref={this.containerRef} {...this.props} style={[this.props.style, shadowStyle]} onTouch={this._onTouchEvent} onLayout={this._onLayout}>
        {this.props.children}
        <Animated.View ref={this.maskRef} style={{
            height: this.state.height,
            width: this.state.width,
            left: -(this.props.borderWidth || 0),
            top: -(this.props.borderWidth || 0),
            backgroundColor: this.props.maskColor,
            borderRadius: this.state.maskBorderRadius,
            opacity: this._animatedAlpha,
            overflow: this.props.maskEnabled ? 'hidden' : 'visible',
            position: 'absolute',
        }}>
          <Animated.View ref={this.rippleRef} style={Object.assign({ height: this.state.ripple.dia, width: this.state.ripple.dia }, this.state.ripple.offset, { backgroundColor: this.props.rippleColor, borderRadius: this.state.ripple.radii, transform: [{ scale: this._animatedRippleScale }] })}/>
        </Animated.View>
      </MKTouchable>);
    }
    _onLayoutChange({ width, height }) {
        if (width === this.state.width && height === this.state.height) {
            return;
        }
        this.setState(Object.assign({}, this._calcMaskLayer(width, height), { height,
            width }));
    }
    // update Mask layer's dimension
    _calcMaskLayer(width, height) {
        const maskRadiiPercent = this.props.maskBorderRadiusInPercent;
        let maskBorderRadius = this.props.maskBorderRadius || 0;
        if (maskRadiiPercent) {
            // eslint-disable-next-line prettier/prettier
            maskBorderRadius = Math.min(width, height) * maskRadiiPercent / 100;
        }
        return { maskBorderRadius };
    }
    // update Ripple layer's dimension
    _calcRippleLayer(x0, y0) {
        const { width, height, maskBorderRadius } = this.state;
        const maskRadiusPercent = this.props.maskBorderRadiusInPercent || 0;
        let radii;
        let hotSpotX = x0;
        let hotSpotY = y0;
        if (this.props.rippleLocation === 'center') {
            hotSpotX = width / 2;
            hotSpotY = height / 2;
        }
        const offsetX = Math.max(hotSpotX, width - hotSpotX);
        const offsetY = Math.max(hotSpotY, height - hotSpotY);
        // FIXME Workaround for Android not respect `overflow`
        // @see https://github.com/facebook/react-native/issues/3198
        if (Platform.OS === 'android' &&
            this.props.rippleLocation === 'center' &&
            this.props.maskEnabled &&
            maskRadiusPercent > 0) {
            // limit ripple to the bounds of mask
            radii = maskBorderRadius;
        }
        else {
            radii = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
        }
        return {
            ripple: {
                dia: radii * 2,
                offset: {
                    left: hotSpotX - radii,
                    top: hotSpotY - radii,
                },
                radii,
            },
        };
    }
    _onPointerDown(evt) {
        this.setState(Object.assign({}, this._calcRippleLayer(evt.x, evt.y)));
        this.showRipple();
    }
    _onPointerUp() {
        this.hideRipple();
    }
}
/** Default props */
Ripple.defaultProps = defaultProps;
//# sourceMappingURL=Ripple.js.map