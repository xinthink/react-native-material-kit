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
  accentColor: MKColor.Pink,
  bgPlain: 'rgba(158,158,158,.2)',
  bgDisabled: 'rgba(0,0,0,.12)',
  fontColor: 'rgb(117, 117, 117)',
  fontSize: 14,
  rippleColor: 'rgba(255,255,255,0.125)',
};

//
// ## <section id='setTheme'>setTheme</section>
// Set the default theme
// - {object} `theme` new [theme](#theme)
// - @see http://www.getmdl.io/customize
//
exports.setTheme = (aTheme) => {
  Object.assign(theme, aTheme);
};

//
// ## <section id='getTheme'>getTheme</section>
// Retrieve the default theme
//
exports.getTheme = () => {
  return theme;
};
