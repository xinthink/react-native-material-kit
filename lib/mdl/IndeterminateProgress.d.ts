/**
 * MDL style indeterminate progress bar component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL Progress Bar}
 *
 * Created by ywu on 16/2/13.
 */
import { Component } from 'react';
import { SimpleProgressProps } from './progress_common';
/**
 * Indeterminate linear progress indicator.
 *
 * @remarks
 * Continually growing and shrinking along the track until the process is complete. See {@link SimpleProgressProps} for the available props.
 *
 * Refer to {@link https://material.io/design/components/progress-indicators.html#linear-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL implementation}
 */
export default class IndeterminateProgress extends Component<SimpleProgressProps> {
    /** Defaults, see {@link defaultSimpleProps} */
    static defaultProps: SimpleProgressProps;
    /** Reference to App's {@link Theme} */
    private theme;
    /** line length when progress is 100% */
    private _totalLength;
    /** height of the progress or line width */
    private _height;
    /** state of the 1st progress block */
    private _animatedBlock1;
    /** state of the 2nd progress block */
    private _animatedBlock2;
    constructor(props: SimpleProgressProps);
    /** {@inheritDoc @types/react#Component.render} */
    render(): JSX.Element;
    private _onLayout;
    private _aniUpdateProgress;
    private _getBlock2Ani;
}
//# sourceMappingURL=IndeterminateProgress.d.ts.map