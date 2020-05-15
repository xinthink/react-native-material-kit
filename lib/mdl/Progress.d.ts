/**
 * MDL style progress bar component.
 *
 * Refer to {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL Progress Bar}
 *
 * Created by ywu on 15/8/7.
 */
import { Component } from 'react';
import IndeterminateProgress from './IndeterminateProgress';
import { ProgressProps } from './progress_common';
/**
 * Determinate linear progress indicator.
 *
 * @remarks
 * Increasing in width from 0 to 100% of the track, in sync with the process’s progress, with a simplified buffering effect.
 * Refer to {@link https://material.io/design/components/progress-indicators.html#linear-progress-indicators | Guideline} or {@link http://www.getmdl.io/components/index.html#loading-section/progress | MDL implementation}
 */
export default class Progress extends Component<ProgressProps> {
    /** The indeterminate version of {@link Progress} */
    static Indeterminate: typeof IndeterminateProgress;
    /** Defaults, see {@link defaultSimpleProps} */
    static defaultProps: ProgressProps;
    /** Reference to App's {@link Theme} */
    private theme;
    /** current progress value, [0, 1] */
    private _progress;
    /** current buffering value, [0, 1] */
    private _buffer;
    /** line length when progress is 100% */
    private _totalLength;
    /** height of the progress or line width */
    private _height;
    private _animatedLength;
    private _animatedBufferLength;
    constructor(props: ProgressProps);
    /** Update progress with animation */
    /** Get current progress */
    progress: number;
    /** Update buffering progress with animation */
    /** Get current buffering progress */
    buffer: number;
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: ProgressProps): void;
    /** {@inheritDoc @types/react#Component.render} */
    render(): JSX.Element;
    private _onLayout;
    private _aniUpdateProgress;
    private _aniUpdateBuffer;
}
//# sourceMappingURL=Progress.d.ts.map