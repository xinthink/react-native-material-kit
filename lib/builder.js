//
// Boilerplate for styling MK Components
// - [Builder](#Builder)
// - [TextViewBuilder](#TextViewBuilder)
//
// Created by ywu on 15/7/16.
//
import { getTheme } from './theme';

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
      value(v) {
        this[name] = v;
        return this;
      },
    });
  }

  // Convenient util to define a builder method for each prop of the component
  // - {`object`} `propTypes` propTypes of the given component
  // - {`():boolean`} `filter` predictor to determine which prop would has a builder method
  static defineProps(propTypes, filter = () => true) {
    const self = this;
    Object.getOwnPropertyNames(propTypes).forEach((prop) => {
      if (!self.hasOwnProperty(prop) && filter(prop)) {
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

  withBackgroundColor(color) {
    this.backgroundColor = color;
    return this;
  }

  withStyle(v) {
    this.style = this.style ? [this.style, v] : v;
    return this;
  }

  build() {
  }

  toProps() {
    this.mergeStyle();
    return Object.assign({}, this);
  }

  getThemeColor() {
    return this.accent ? getTheme().accentColor : getTheme().primaryColor;
  }

  mergeStyle() {
    this.mergeStyleWith({
      backgroundColor: this.backgroundColor,
    });
  }

  choseBackgroundColor() {
    this.backgroundColor = this.backgroundColor || this.getThemeColor();
  }

  mergeStyleWith(base) {
    this.style = [].concat(base, this.style);
  }
}


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
