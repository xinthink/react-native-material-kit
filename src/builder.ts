//
// Boilerplate for styling MK Components
// - [Builder](#Builder)
// - [TextViewBuilder](#TextViewBuilder)
//
// Created by ywu on 15/7/16.
//
import {
  AttrValue,
  getTheme,
  NullableAttrValue,
  NullableStyle,
  Style,
} from './theme';
import {
  capitalize,
} from './utils'


//
// ## <section id='Builder'>Builder</section>
// Base class of MK Component builder
//
export class Builder {
  [index: string]: any // index signature

  // Define builder method `withXxx` for prop `xxx`
  static defineProp(name: string) {
    const methodName = `with${capitalize(name)}`;
    if (this.prototype[methodName]) {
      return;
    }

    Object.defineProperty(this.prototype, methodName, {
      enumerable: false,
      value(v: any) {
        this[name] = v;
        return this;
      },
    });
  }

  // Convenient util to define a builder method for each prop of the component
  // - {`object`} `propTypes` propTypes of the given component
  // - {`():boolean`} `filter` predictor to determine which prop would has a builder method
  static defineProps(propTypes: object, filter = (p: string) => true) {
    const self = this;
    Object.getOwnPropertyNames(propTypes).forEach((prop) => {
      if (!self.hasOwnProperty(prop) && filter(prop)) {
        Builder.defineProp.call(self, prop);
      }
    });
  }

  // Background color
  backgroundColor: NullableAttrValue = undefined

  // Accent color
  accent: NullableAttrValue = undefined

  // Style
  style: NullableStyle = undefined

  getTheme = getTheme;

  // Accent color
  withAccent(v: string) {
    this.accent = v;
    return this;
  }

  withBackgroundColor(color: string) {
    this.backgroundColor = color;
    return this;
  }

  withStyle(v: Style) {
    this.style = this.style ? [this.style, v] : v;
    return this;
  }

  build() {
    // do nothing
  }

  toProps() {
    this.mergeStyle();
    return Object.assign({}, this);
  }

  getThemeColor(): AttrValue {
    return this.accent ? getTheme().accentColor : getTheme().primaryColor;
  }

  choseBackgroundColor() {
    this.backgroundColor = this.backgroundColor || this.getThemeColor();
  }

  mergeStyle() {
    this.mergeStyleWith({
      backgroundColor: this.backgroundColor,
    });
  }

  mergeStyleWith(base: Style) {
    this.style = ([] as NullableStyle[]).concat(base, this.style);
  }
}
