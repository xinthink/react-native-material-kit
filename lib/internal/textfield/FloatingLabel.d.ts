/**
 * `FloatingLabel` component of {@link Textfield}s.
 */
import { Component } from 'react';
import { Animated, MeasureOnSuccessCallback, TextStyle } from 'react-native';
/** Public props of {@link FloatingLabel} */
export interface FloatingLabelPublicProps {
    /** Enable floating label effect */
    floatingLabelEnabled?: boolean;
    /** Duration of floating transition, also affect underline animation */
    floatingLabelAniDuration?: number;
    /** Spacing between floating label and input text */
    floatingLabelBottomMargin?: number;
    /** {@link TextStyle} of floating label */
    floatingLabelFont?: TextStyle;
}
/** Internal Props of {@link FloatingLabel} */
export interface FloatingLabelProps extends FloatingLabelPublicProps {
    /** The initial label text */
    label: string;
    tint?: any;
    highlightColor?: any;
    opacityAniDur?: number;
    /** Specifies should fonts scale to respect Text Size accessibility setting on iOS. */
    allowFontScaling?: boolean;
}
/** State of {@link FloatingLabel} */
interface FloatingLabelState {
    progress: Animated.Value;
    opacity: Animated.Value;
    label: string;
}
/**
 * The `FloatingLabel` component of a {@link Textfield}.
 */
export default class FloatingLabel extends Component<FloatingLabelProps, FloatingLabelState> {
    /** Defaults, see {@link defaultProps} */
    static defaultProps: Partial<FloatingLabelProps>;
    private labelDim;
    private offsetX;
    private placeholderHeight;
    private labelRef;
    constructor(props: FloatingLabelProps);
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: FloatingLabelProps): void;
    /** Update the label text */
    updateLabel(label?: string): void;
    /**
     * Determines the location on screen, width, and height of the given view and
     * returns the values via an async callback.
     */
    measure(cb: MeasureOnSuccessCallback): void;
    /** Start the floating animation */
    aniFloatLabel(): Animated.CompositeAnimation[];
    /** Start the collapse animation */
    aniSinkLabel(): Animated.CompositeAnimation[];
    render(): JSX.Element;
    private _onLabelLayout;
}
export {};
//# sourceMappingURL=FloatingLabel.d.ts.map