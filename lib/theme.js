// Theme definition
//
// Created by ywu on 15/7/18.
//
import MKColor from './MKColor';

const theme = {};

class AttrReference {
  constructor(attr) {
    this.attr = attr;
  }

  get value() {
    return theme[this.attr];
  }
}

class RGBAttrReference extends AttrReference {
  constructor(attr, alpha) {
    super(attr);
    this.alpha = alpha;
  }

  get value() {
    const v = super.value;
    return this.alpha > 0 ? `rgba(${v}, ${this.alpha})` : `rgb(${v})`;
  }
}

const primaryColorRef = new AttrReference('primaryColor');
const accentColorRef = new AttrReference('accentColor');

//
// ## <section id='theme'>theme</section>
//
Object.assign(theme, {
  primaryColor: MKColor.Indigo,
  primaryColorRGB: MKColor.RGBIndigo,
  accentColor: MKColor.Pink,
  accentColorRGB: MKColor.RGBPink,
  bgPlain: 'rgba(158, 158, 158, 0.2)',
  bgDisabled: 'rgba(0, 0, 0, 0.12)',
  fontColor: 'rgb(117, 117, 117)',
  fontSize: 14,
  rippleColor: 'rgba(255, 255, 255, 0.125)',
  textfieldStyle: {
    tintColor: 'rgba(0, 0, 0, 0.12)',
    highlightColor: new RGBAttrReference('primaryColorRGB', 0.9),
    textInputStyle: {
      color: new AttrReference('fontColor'),
      fontSize: 16,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  progressStyle: {
    backgroundColor: new RGBAttrReference('primaryColorRGB', 0.3),
    progressColor: primaryColorRef,
    bufferColor: new RGBAttrReference('primaryColorRGB', 0.3),
  },
  spinnerStyle: {
    strokeColor: [
      MKColor.palette_blue_400,
      MKColor.palette_red_500,
      MKColor.palette_yellow_600,
      MKColor.palette_green_500,
    ],
  },
  sliderStyle: {
    lowerTrackColor: primaryColorRef,
    upperTrackColor: '#cccccc',
  },
  iconToggleStyle: {
    onColor: new RGBAttrReference('primaryColorRGB', 0.4),
    offColor: 'rgba(0, 0, 0, 0.25)',
    rippleColor: new AttrReference('bgPlain'),
  },
  switchStyle: {
    onColor: new RGBAttrReference('primaryColorRGB', 0.4),
    offColor: 'rgba(0, 0, 0, 0.25)',
    thumbOnColor: primaryColorRef,
    thumbOffColor: MKColor.Silver,
    rippleColor: new RGBAttrReference('primaryColorRGB', 0.2),
  },
  radioStyle: {
    borderOnColor: primaryColorRef,
    borderOffColor: primaryColorRef,
    fillColor: primaryColorRef,
    rippleColor: new RGBAttrReference('primaryColorRGB', 0.2),
  },
  checkboxStyle: {
    borderOnColor: primaryColorRef,
    borderOffColor: 'rgba(0, 0, 0, 0.56)',
    fillColor: primaryColorRef,
    rippleColor: new RGBAttrReference('primaryColorRGB', 0.2),
    inset: 0,
  },
  cardStyle: {
    backgroundColor: '#ffffff',
    borderRadius: 2,
    borderColor: '#ffffff',
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 2,
    },
  },
  cardImageStyle: {
    height: 170,
    resizeMode: 'cover',
  },
  cardTitleStyle: {
    position: 'absolute',
    top: 120,
    left: 26,
    backgroundColor: 'transparent',
    padding: 16,
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
  },
  cardContentStyle: {
    padding: 15,
    color: 'rgba(0, 0, 0, 0.54)',
  },
  cardActionStyle: {
    borderStyle: 'solid',
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    padding: 15,
  },
  cardMenuStyle: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'transparent',
  },
});

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
    get() {
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
