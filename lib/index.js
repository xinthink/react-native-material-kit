/**
 * Created by ywu on 15/6/1.
 */
exports.setTheme = require('./theme').setTheme;
exports.getTheme = require('./theme').getTheme;

exports.mdl = require('./mdl');

exports.MKColor = require('./MKColor');

// Shortcuts, and also compatibility for legacy native components like MKButton
exports.MKButton = exports.mdl.Button;
exports.MKTextField = exports.mdl.Textfield;
exports.MKSwitch = exports.mdl.Switch;
exports.MKIconToggle = exports.mdl.IconToggle;

exports.MKRipple = exports.mdl.Ripple;
exports.MKProgress = exports.mdl.Progress;
exports.MKSlider = exports.mdl.Slider;
exports.MKSpinner = exports.mdl.Spinner;
exports.MKRadioButton = exports.mdl.RadioButton;
exports.MKCheckbox = exports.mdl.Checkbox;

exports.MKCard = exports.mdl.Card;
exports.MKCardTitle = exports.mdl.Title;
exports.MKCardImage = exports.mdl.MKCardImage;
exports.MKCardContent = exports.mdl.MKCardContent;
exports.MKCardMenu = exports.mdl.MKCardMenu;
exports.MKCardAction = exports.mdl.MKCardAction;
exports.MKCardStyles = exports.mdl.MKCardStyles;
