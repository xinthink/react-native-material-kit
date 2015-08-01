//
// Boilerplate for styling MK Components
// - [Builder](#Builder)
// - [TextViewBuilder](#TextViewBuilder)
//
// Created by ywu on 15/7/16.
//
const {getTheme} = require('./theme');
const {mkLayerPropTypes} = require('./MKPropTypes');
const {TouchableWithoutFeedback} = require('react-native');

function capitalize(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}


//
// ## <section id='Builder'>Builder</section>
// Base class of MK Component builder
//
class Builder {

  // Define builder method `withXxx` for prop `xxx`
  static defineProp(name) {
    const methodName = `with${capitalize(name)}`;
    if (this.prototype[methodName]) {
      return;
    }

    Object.defineProperty(this.prototype, methodName, {
      enumerable: false,
      value: function (v) {
        this[name] = v;
        return this;
      },
    });
  }

  // Convenient util to define a builder method for each prop of the component
  // - {`object`} `propTypes` propTypes of the given component
  // - {`():boolean`} `filter` predictor to determine which prop would has a builder method
  static defineProps(propTypes, filter = ()=>true) {
    const self = this;
    Object.getOwnPropertyNames(propTypes).forEach((prop) => {
      if (filter(prop)) {
        Builder.defineProp.call(self, prop);
      }
    });
  }

  getTheme() {
    return getTheme();
  }

  withAccent(v) {
    this.accent = v;
    return this;
  }

  withStyle(v) {
    this.style = v;
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


// define builder method for common [MKLayer props](MKPropTypes.html#mkLayerPropTypes)
Builder.defineProps(mkLayerPropTypes);

// define builder method for common Touchable props
Builder.defineProps(TouchableWithoutFeedback.propTypes);


//
// ## <section id='TextViewBuilder'>TextViewBuilder</section>
// Text-based component builder
//
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


// ## Public interface
exports.Builder = Builder;
exports.TextViewBuilder = TextViewBuilder;
