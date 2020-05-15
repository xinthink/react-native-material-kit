/**
 * MDL style textfield component.
 *
 * See {@link http://www.getmdl.io/components/index.html#textfields-section | MDL Textfield}
 *
 * Created by ywu on 15/8/3.
 */
import { Component } from 'react';
import { StyleProp, TextInputProps, TextStyle } from 'react-native';
import { FloatingLabelPublicProps } from '../internal/textfield/FloatingLabel';
import { UnderlinePublicProps } from '../internal/textfield/Underline';
/** Props of the {@link Textfield} component */
export interface TextfieldProps extends TextInputProps, FloatingLabelPublicProps, UnderlinePublicProps {
    /** alias to `onChangeText` */
    onTextChange?: (text: string) => void;
    /** Alias to `secureTextEntry` */
    password?: boolean;
    /** Color of the un-highlighted underline, and the placeholder
     * - TODO cursor color is not affected for now
     * @see https://github.com/facebook/react-native/issues/1685
     */
    tint?: any;
    /** Color of the highlighted underline, and also the floating label */
    highlightColor?: any;
    /** Style applied to the `TextInput` component, ok to use `StyleSheet` */
    textInputStyle?: StyleProp<TextStyle>;
    /** Additional props passed directly to the react native `TextInput` component */
    additionalInputProps?: TextInputProps;
}
/** State of the {@link Textfield} component */
interface TextfieldState {
    inputMarginTop: number;
}
/**
 * The `Textfield` component, which has an optional {@link FloatingLabel} and {@link Underline}.
 * - TODO styling `read-only` & `disabled` mode
 */
export default class Textfield extends Component<TextfieldProps, TextfieldState> {
    /** Defaults, see {@link defaultProps} */
    static defaultProps: Partial<TextfieldProps>;
    private theme;
    private readonly inputFrame;
    private inputRef;
    private labelRef;
    private underlineRef;
    private anim?;
    private _bufferedValue;
    constructor(props: TextfieldProps);
    private bufferedValue;
    private placeholder;
    /**
     * Requests focus for the given input or view. The exact behavior triggered
     * will depend on the platform and type of view.
     */
    focus(): void;
    /**
     * Checks if the input is currently focused.
     */
    isFocused(): boolean;
    /**
     * Removes focus from an input or view. This is the opposite of `focus()`.
     */
    blur(): void;
    UNSAFE_componentWillMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: TextfieldProps): void;
    componentDidMount(): void;
    render(): JSX.Element;
    private _onTextChange;
    private _onFocus;
    private _onBlur;
    private startAnimations;
    private _doMeasurement;
    private _onLabelMeasured;
    private _onInputMeasured;
    private _aniFloatLabel;
    private _aniStartHighlight;
    private _aniStopHighlight;
    private _callback;
}
export {};
//# sourceMappingURL=Textfield.d.ts.map