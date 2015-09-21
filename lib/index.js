/**
 * Created by ywu on 15/6/1.
 */
exports.setTheme = require('./theme').setTheme;
exports.getTheme = require('./theme').getTheme;

exports.mdl = require('./mdl');

exports.MKColor = require('./MKColor');
exports.MKIconToggle = require('./MKIconToggle');

// Shortcuts, and also compatibility for legacy native components like MKButton
// exports.MKButton = require('./MKButton');
exports.MKButton = exports.mdl.Button;
exports.MKTextField = exports.mdl.Textfield;
exports.MKSwitch = exports.mdl.Switch;

exports.MKRipple = exports.mdl.Ripple;
exports.MKProgress = exports.mdl.Progress;
exports.MKSlider = exports.mdl.Slider;
exports.MKSpinner = exports.mdl.Spinner;
