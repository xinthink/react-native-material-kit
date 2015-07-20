/**
 * Created by ywu on 15/7/18.
 */
var MKColor = require('./MKColor');
var utils = require('./utils');

var theme = {
  primaryColor: MKColor.Indigo,
  accentColor: MKColor.Pink,
  bgPlain: 'rgba(158,158,158,.2)',
  bgDisabled: 'rgba(0,0,0,.12)',
  fontColor: 'rgb(117, 117, 117)',
  fontSize: 14,
};

/**
 * Set the default theme
 * @param theme {
 *  primaryColor
    accentColor
    bgPlain
    bgDisabled
    fontSize
 * }
 * @see http://www.getmdl.io/customize
 */
exports.setTheme = (aTheme) => {
  utils.mergeIntoFast(theme, aTheme);
};

/**
 * TODO make it immutable
 */
exports.getTheme = () => {
  return theme;
};
