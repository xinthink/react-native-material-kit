// Theme definition
//
// Created by ywu on 15/7/18.
//
const MKColor = require('./MKColor');

//
// ## <section id='theme'>theme</section>
//
const theme = {
  primaryColor: MKColor.Indigo,
  RGBPrimaryColor: MKColor.RGBIndigo,
  accentColor: MKColor.Pink,
  RGBAccentColor: MKColor.RGBPink,
  bgPlain: 'rgba(158,158,158,.2)',
  bgDisabled: 'rgba(0,0,0,.12)',
  fontColor: 'rgb(117, 117, 117)',
  fontSize: 14,
  rippleColor: 'rgba(255,255,255,0.125)',
  toggleStyle: {
    onColor: `rgba(${MKColor.RGBIndigo},.4)`,
    offColor: 'rgba(0,0,0,0.25)',
    thumbOnColor: MKColor.Indigo,
    thumbOffColor: MKColor.Silver,
    rippleColor: `rgba(${MKColor.RGBIndigo},.2)`,
  },
  radioStyle: {
    borderOnColor: MKColor.Indigo,
    borderOffColor: MKColor.Indigo,
    fillColor: MKColor.Indigo,
    rippleColor: `rgba(${MKColor.RGBIndigo},.2)`,
  },
  checkboxStyle: {
    borderOnColor: MKColor.Indigo,
    borderOffColor: MKColor.Grey,
    fillColor: MKColor.Indigo,
    rippleColor: `rgba(${MKColor.RGBIndigo},.2)`,
    tickInsetHorizontal: 3,
    tickInsetVertical: 6,
  },
};

//
// ## <section id='setTheme'>setTheme</section>
// Set the current theme
// - {object} `theme` new [theme](#theme)
// - @see http://www.getmdl.io/customize
//
exports.setTheme = (aTheme) => {
  Object.assign(theme, aTheme);
};

//
// ## <section id='getTheme'>getTheme</section>
// Retrieve a copy of the current theme
//
exports.getTheme = () => {
  return Object.assign({}, theme);
};
