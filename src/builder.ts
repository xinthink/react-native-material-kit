//
// Boilerplate for styling MK Components
// - [Builder](#Builder)
// - [TextViewBuilder](#TextViewBuilder)
//
// Created by ywu on 15/7/16.
//
import {
  getTheme,

  // types
  AttrValue,
  NullableAttrValue,
  NullableStyle,
  Style,
} from './theme';
import {
  capitalize,
  NullableString,
} from './utils'


//
// ## <section id='Builder'>Builder</section>
// Base class of MK Component builder
//
export class Builder {
  [index: string]: any // index signature

  // Background color
  backgroundColor: NullableAttrValue = undefined

  // Accent color
  accent: NullableAttrValue = undefined

  // Style
  style: NullableStyle = undefined

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


//
// ## <section id='TextViewBuilder'>TextViewBuilder</section>
// Text-based component builder
//
export class TextViewBuilder extends Builder {
  text: NullableString = undefined
  textStyle: NullableStyle = undefined

  withText(text: string) {
    this.text = text;
    return this;
  }

  withTextStyle(style: Style) {
    this.textStyle = style;
    return this;
  }

  mergeTextStyleWith(base: Style) {
    this.textStyle = ([] as Array<NullableStyle>).concat(base, this.textStyle);
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
