// Theme definition
//
// Created by ywu on 15/7/18.
//
const MKColor = require('./MKColor');

let theme;

class AttrReference {
  constructor(attr) {
    this.attr = attr;
  }

  get value() {
    return theme[this.attr]
  }
}

class RGBAttrReference extends AttrReference {
  constructor(attr, alpha) {
    super(attr);
    this.alpha = alpha;
  }

  get value() {
    const v = super.value;
    return this.alpha > 0 ? `rgba(${v},${this.alpha})` : `rgb(${v})`;
  }
}

const primaryColorRef = new AttrReference('primaryColor');
const accentColorRef = new AttrReference('accentColor');

//
// ## <section id='theme'>theme</section>
//
theme = {
  primaryColor: MKColor.Indigo,
  primaryColorRGB: MKColor.RGBIndigo,
  accentColor: MKColor.Pink,
  accentColorRGB: MKColor.RGBPink,
  bgPlain: 'rgba(158,158,158,.2)',
  bgDisabled: 'rgba(0,0,0,.12)',
  fontColor: 'rgb(117, 117, 117)',
  fontSize: 14,
  rippleColor: 'rgba(255,255,255,.125)',
  toggleStyle: {
    onColor: `rgba(${MKColor.RGBIndigo},.4)`,
    offColor: 'rgba(0,0,0,0.25)',
    thumbOnColor: MKColor.Indigo,
    thumbOffColor: MKColor.Silver,
    rippleColor: `rgba(${MKColor.RGBIndigo},.2)`,
  },
  radioStyle: {
    borderOnColor: primaryColorRef,
    borderOffColor: primaryColorRef,
    fillColor: primaryColorRef,
    rippleColor: new RGBAttrReference('primaryColorRGB', .2),
  },
  checkboxStyle: {
    borderOnColor: primaryColorRef,
    borderOffColor: 'rgba(0,0,0,.56)',
    fillColor: primaryColorRef,
    rippleColor: new RGBAttrReference('primaryColorRGB', .2),
    inset: 0,
  },
};

function isPlainObject(o) {
  return typeof o === 'object' && !Array.isArray(o) && o !== null &&
    !(o instanceof String) && !(o instanceof Function);
}

//
// Wrap style object with custom getter, for resolving the attribute references.
//
function wrapAttrRef(style, attr, attrValue) {
  Object.defineProperty(style, attr, {
    enumerable: true,
    get: function () {
      return attrValue.value;
    },
  });
}

//
// Wrap all style attributes with custom getter, recursively
//
function wrapStyle(style) {
  Object.getOwnPropertyNames(style).forEach((attr) => {
    const v = style[attr];
    if (v instanceof AttrReference) {
      wrapAttrRef(style, attr, v);
    } else if (isPlainObject(v)) {
      wrapStyle(v);
    }
  });

  return style;
}

// Wrap the theme object, in order to resolving the attribute references.
wrapStyle(theme);

//
// ## <section id='setTheme'>setTheme</section>
// Set the current theme
// - {object} `theme` new [theme](#theme)
// - @see http://www.getmdl.io/customize
//
function setTheme(aTheme) {
  Object.assign(theme, aTheme);
}

//
// ## <section id='getTheme'>getTheme</section>
// Retrieve a copy of the current theme
//
function getTheme() {
  return Object.assign({}, theme);
}

exports.setTheme = setTheme;
exports.getTheme = getTheme;
exports.theme = {
  AttrReference,
  RGBAttrReference,
  primaryColorRef,
  accentColorRef,
};
