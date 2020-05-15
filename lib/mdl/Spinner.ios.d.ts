/**
 * MDL style Spinner component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/spinner | MDL Spinner}
 *
 * Created by ywu on 15/8/14.
 */
import { Component } from 'react';
import { SpinnerProps, SpinnerState } from './spinner_common';
/**
 * The default `Spinner` component.
 *
 * @remarks
 * See {@link SpinnerProps} for the available props.
 *
 * Refer to {@link https://material.io/design/components/progress-indicators.html#circular-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/spinner | MDL implementation}
 */
export default class Spinner extends Component<SpinnerProps, SpinnerState> {
    /** Default props of {@link Spinner} */
    static defaultProps: SpinnerProps;
    /** Reference to App's {@link Theme} */
    private theme;
    private _nextStrokeColorIndex;
    private _animatedContainerAngle;
    private _animatedArcAngle;
    constructor(props: SpinnerProps);
    /** {@inheritDoc @types/react#Component.render} */
    render(): JSX.Element;
    private _onLayout;
    private _aniUpdateSpinner;
    private _renderSpinnerLayer;
    private _updateStrokeColor;
}
//# sourceMappingURL=Spinner.ios.d.ts.map