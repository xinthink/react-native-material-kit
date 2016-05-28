//
// MDL style Spinner component.
//
// - @see [MDL Spinner](http://www.getmdl.io/components/index.html#loading-section/spinner)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/8/14.
//

import React, {
  Component,
  PropTypes,
} from 'react';

import {
  requireNativeComponent,
  View,
} from 'react-native';

import { getTheme } from '../theme';
import * as utils from '../utils';

// ## <section id='props'>Props</section>
const PROP_TYPES = {
  // [View Props](https://facebook.github.io/react-native/docs/view.html#props)...
  ...View.propTypes,

  // Colors of the progress stroke
  // - {`Array`|`String`} can be a list of colors
  // or a single one
  strokeColor: PropTypes.any,

  // Width of the progress stroke
  strokeWidth: PropTypes.number,

  // Duration of the spinner animation, in milliseconds
  spinnerAniDuration: PropTypes.number,

  // FIXME `no propType for native prop` error on Android
  scaleX: PropTypes.number,
  scaleY: PropTypes.number,
  translateX: PropTypes.number,
  translateY: PropTypes.number,
  rotation: PropTypes.number,
};

const NativeSpinner = requireNativeComponent('MKSpinner', {
  name: 'MKSpinner',
  propTypes: {
    ...PROP_TYPES,
    strokeColors: PropTypes.array,  // native prop for internal usage
  },
});

//
// ## <section id='Spinner'>Spinner</section>
// The default `Spinner` component.
//
class Spinner extends Component {

  static propTypes = PROP_TYPES;

  // ## <section id='defaults'>Defaults</section>
  static defaultProps = {
    strokeWidth: 3,
    spinnerAniDuration: 1333,
    style: {
      width: 28,
      height: 28,
    },
  };

  constructor(props) {
    super(props);
    this.theme = getTheme();
  }

  render() {
    const strokeColors = utils.parseColor(this.props.strokeColor ||
      this.theme.spinnerStyle.strokeColor);
    const props = Object.assign({}, this.props, {
      strokeColors: Array.isArray(strokeColors) ? strokeColors : [strokeColors],
    });

    return (
      <NativeSpinner
        {...props}
        style={[Spinner.defaultProps.style, props.style]}
      />
    );
  }
}


// --------------------------
// Builder
//
const {
  Builder,
} = require('../builder');

//
// ## Spinner builder
//
class SpinnerBuilder extends Builder {
  build() {
    const BuiltSpinner = class extends Spinner {};
    BuiltSpinner.defaultProps = Object.assign({}, Spinner.defaultProps, this.toProps());
    return BuiltSpinner;
  }
}

// define builder method for each prop
SpinnerBuilder.defineProps(Spinner.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//
function spinner() {
  return new SpinnerBuilder();
}

function singleColorSpinner() {
  return spinner().withStrokeColor(getTheme().primaryColor);
}


// ## Public interface
module.exports = Spinner;
Spinner.Builder = SpinnerBuilder;
Spinner.spinner = spinner;
Spinner.singleColorSpinner = singleColorSpinner;
