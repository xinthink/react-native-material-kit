/**
 * `Underline` component of {@link Textfield}s.
 */
import { Component } from 'react';
import { Animated } from 'react-native';
/** Props of the {@link Underline} component */
export interface UnderlinePublicProps {
    /** The highlighted bottom border effect */
    underlineEnabled?: boolean;
    /** The thickness of the Underline */
    underlineSize?: number;
}
export interface UnderlineProps extends UnderlinePublicProps {
    tint?: any;
    highlightColor?: any;
    /** Animation duration of the Underline */
    underlineAniDur?: number;
}
/** State of the {@link Underline} component */
interface UnderlineState {
    lineLength: number;
}
/**
 * `Underline` component of a {@link Textfield}.
 */
export default class Underline extends Component<UnderlineProps, UnderlineState> {
    /** Defaults, see {@link defaultProps} */
    static defaultProps: Partial<UnderlineProps>;
    private animatedLeft;
    private animatedLineLength;
    constructor(props: UnderlineProps);
    /** update the length of stretched underline */
    updateLineLength(lineLength: number, cb?: () => void): void;
    /** stretch the line, from center */
    aniStretchUnderline(focused: boolean): Animated.CompositeAnimation[];
    /** collapse the the line to a single point at center */
    aniShrinkUnderline(): Animated.CompositeAnimation[];
    render: () => JSX.Element;
    /** the colorful forefront line, animation enabled */
    private renderUnderline;
}
export {};
//# sourceMappingURL=Underline.d.ts.map