/**
 * MDL style Spinner component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/spinner | MDL Spinner}
 *
 * Created by ywu on 15/8/14.
 */
import React from 'react';
import { requireNativeComponent } from 'react-native';
import { getTheme } from '../theme';
import * as utils from '../utils';
import { defaultProps } from './spinner_common';
const MKSpinner = requireNativeComponent('MKSpinner');
/**
 * The default `Spinner` component.
 *
 * @remarks
 * See {@link SpinnerProps} for the available props.
 *
 * Refer to {@link https://material.io/design/components/progress-indicators.html#circular-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/spinner | MDL implementation}
 */
export default function Spinner(props) {
    const theme = getTheme();
    const strokeColors = utils.parseColor(
    // @ts-ignore
    props.strokeColor || theme.spinnerStyle.strokeColor);
    const _props = Object.assign({}, props, {
        strokeColors: Array.isArray(strokeColors) ? strokeColors : [strokeColors],
    });
    return <MKSpinner {..._props} style={[defaultProps.style, props.style]}/>;
}
/** Default props of {@link Spinner} */
Spinner.defaultProps = defaultProps;
//# sourceMappingURL=Spinner.android.js.map