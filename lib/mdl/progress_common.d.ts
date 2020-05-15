import { ViewProps } from 'react-native';
/** Basic Props of {@link Progress}, which extends {@link ViewProps} */
export interface SimpleProgressProps extends ViewProps {
    /** Color of the progress layer */
    progressColor?: string;
    /** Animation duration (milliseconds) */
    progressAniDuration?: number;
}
/** Props of {@link Progress}, which extends {@link SimpleProgressProps} */
export interface ProgressProps extends SimpleProgressProps {
    /**
     * Initial value of progress, Number: [0, 1.0]
     * @defaultValue `0`
     */
    progress?: number;
    /** Initial value of buffering, Number: [0, 1.0] */
    buffer?: number;
    /** Color of the buffering layer */
    bufferColor?: string;
    /** Duration of the buffering animation, in milliseconds */
    bufferAniDuration?: number;
}
/** Default props of {@link IndeterminateProgress}, which comply with {@link SimpleProgressProps} */
export declare const defaultSimpleProps: SimpleProgressProps;
/** Default props of {@link Progress} */
export declare const defaultProps: ProgressProps;
//# sourceMappingURL=progress_common.d.ts.map