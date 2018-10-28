/**
 * Created by ywu on 15/6/1.
 */
import * as mdl from './mdl';
import * as MKColor from './MKColor';

export { mdl, MKColor };

export { default } from './theme';

// Shortcuts, and also compatibility for legacy native components like MKButton
export {
  Button as MKButton,
  Textfield as MKTextField,
  Switch as MKSwitch,
  IconToggle as MKIconToggle,

  Ripple as MKRipple,
  Progress as MKProgress,
  Slider as MKSlider,
  RangeSlider as MKRangeSlider,
  Spinner as MKSpinner,
  RadioButton as MKRadioButton,
  Checkbox as MKCheckbox,
} from './mdl';
