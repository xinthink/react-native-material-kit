/**
 * Created by ywu on 15/7/18.
 */
const MKColor = require('./MKColor');
const utils = require('./utils');

const theme = {
  primaryColor: MKColor.Indigo,
  accentColor: MKColor.Pink,
  bgPlain: 'rgba(158,158,158,.2)',
  bgDisabled: 'rgba(0,0,0,.12)',
  fontColor: 'rgb(117, 117, 117)',
  fontSize: 14,
};

/**
 * Set the default theme
 * @param {Object} theme
 * @see http://www.getmdl.io/customize
 */
exports.setTheme = (aTheme) => {
  utils.mergeIntoFast(theme, aTheme);
};

/**
 * Retrieve the default theme
 */
exports.getTheme = () => {
  return theme;
};
