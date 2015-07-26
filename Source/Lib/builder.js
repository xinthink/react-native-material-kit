/**
 * Boilerplate for styling MK Components
 * Created by ywu on 15/7/16.
 */
const {getTheme} = require('./theme');


/**
 * Base class of MK Component builder
 */
class Builder {
  constructor() {
    this.getTheme = getTheme;
  }

  withAccent(v) {
    this.accent = v;
    return this;
  }

  withStyle(v) {
    this.style = v;
    return this;
  }

  withShadowColor(v) {
    this.shadowColor = v;
    return this;
  }

  withShadowOffset(v) {
    this.shadowOffset = v;
    return this;
  }

  withShadowOpacity(v) {
    this.shadowOpacity = v;
    return this;
  }

  withShadowRadius(v) {
    this.shadowRadius = v;
    return this;
  }

  withShadowPathEnabled(enabled) {
    this.shadowPathEnabled = enabled;
    return this;
  }

  withCornerRadius(v) {
    this.cornerRadius = v;
    return this;
  }

  withMaskEnabled(v) {
    this.maskEnabled = v;
    return this;
  }

  withRippleEnabled(v) {
    this.rippleEnabled = v;
    return this;
  }

  withBackgroundColor(v) {
    this.backgroundColor = v;
    return this;
  }

  withBackgroundLayerColor(v) {
    this.backgroundLayerColor = v;
    return this;
  }

  withBackgroundLayerCornerRadius(v) {
    this.backgroundLayerCornerRadius = v;
    return this;
  }

  withBackgroundAniEnabled(v) {
    this.backgroundAniEnabled = v;
    return this;
  }

  withRipplePercent(v) {
    this.ripplePercent = v;
    return this;
  }

  withRippleLayerColor(v) {
    this.rippleLayerColor = v;
    return this;
  }

  withRippleAniTimingFunction(v) {
    this.rippleAniTimingFunction = v;
    return this;
  }

  withRippleLocation(v) {
    this.rippleLocation = v;
    return this;
  }

  withOnPress(v) {
    this.onPress = v;
    return this;
  }

  withOnPressIn(v) {
    this.onPressIn = v;
    return this;
  }

  withOnPressOut(v) {
    this.onPressOut = v;
    return this;
  }

  withOnLongPress(v) {
    this.onLongPress = v;
    return this;
  }

  build() {
  }

  toProps() {
    this.mergeStyle();
    this.choseBackgroundColor();
    return Object.assign({}, this);
  }

  getThemeColor() {
    return this.accent ? getTheme().accentColor : getTheme().primaryColor;
  }

  mergeStyle() {
  }

  choseBackgroundColor() {
    this.backgroundColor = this.backgroundColor || this.getThemeColor();
  }

  mergeStyleWith(base) {
    this.style = [].concat(base, this.style);
  }
}

/**
 * Text-based component builder
 */
class TextViewBuilder extends Builder {
  withText(text) {
    this.text = text;
    return this;
  }

  withTextStyle(style) {
    this.textStyle = style;
    return this;
  }

  mergeTextStyleWith(base) {
    this.textStyle = [].concat(base, this.textStyle);
  }

  mergeStyle() {
    super.mergeStyle();
    this.mergeStyleWith({
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    });
    this.mergeTextStyleWith({
      fontSize: getTheme().fontSize,
    });
  }
}


exports.Builder = Builder;
exports.TextViewBuilder = TextViewBuilder;
