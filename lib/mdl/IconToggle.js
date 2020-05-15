/**
 * MDL-style Icon Toggle component.
 *
 * See {@link https://getmdl.io/components/index.html#toggles-section/icon-toggle | MDL Icon Toggle}
 *
 * Created by ywu on 15/10/07.
 */
import React, { Children, Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import MKColor from '../MKColor';
import { getTheme } from '../theme';
import * as utils from '../utils';
import Ripple from './Ripple';
/** Check if the `stateChecked` prop matches the `isChecked` state. */
function isViewForState(view, isChecked) {
    if (!view) {
        return false;
    }
    // @ts-ignore
    const props = view.hasOwnProperty('props') ? view.props : {};
    return (props.stateChecked && isChecked) || !(props.stateChecked || isChecked);
}
/** Default props of {@link IconToggle} */
const defaultProps = {
    checked: false,
    enabled: true,
    maskColor: MKColor.Transparent,
    pointerEvents: 'box-only',
    style: {
        height: 56,
        width: 56,
        alignItems: 'center',
        borderColor: 'rgba(0,0,0,.54)',
        justifyContent: 'center',
    },
};
/**
 * The `IconToggle` component.
 *
 * See {@link https://getmdl.io/components/index.html#toggles-section/icon-toggle | MDL implementation}
 */
export default class IconToggle extends Component {
    constructor(props) {
        super(props);
        this.theme = getTheme();
        /**
         * Select a child element to show for the current toggle status.
         * @see [State List](http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList) in Android development
         */
        this.renderChildren = () => Children.map(this.props.children, child => child && isViewForState(child, this.state.checked) ? child : undefined);
        /** Touch event handler */
        this.onTouch = ({ type }) => {
            if (type === 'TOUCH_UP') {
                this.confirmToggle();
            }
        };
        this.state = { checked: false };
    }
    UNSAFE_componentWillMount() {
        this.setState({ checked: this.props.checked || false });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.checked !== this.props.checked && nextProps.checked !== this.state.checked) {
            this.setState({ checked: nextProps.checked || false });
        }
    }
    render() {
        const mergedStyle = Object.assign({}, this.theme.iconToggleStyle, utils.compact({
            rippleColor: this.props.rippleColor,
        }));
        return (<TouchableWithoutFeedback {...utils.extractTouchableProps(this)}>
        <Ripple {...this.props} rippleColor={mergedStyle.rippleColor} style={[defaultProps.style, this.props.style]} maskBorderRadiusInPercent={50} rippleLocation="center" onTouch={this.onTouch}>
          {this.renderChildren()}
        </Ripple>
      </TouchableWithoutFeedback>);
    }
    /** When a toggle action (from the given state) is confirmed. */
    confirmToggle() {
        const prevState = this.state.checked;
        this.setState({ checked: !prevState }, () => this.props.onCheckedChange && this.props.onCheckedChange({ checked: this.state.checked }));
    }
}
/** Default props */
IconToggle.defaultProps = defaultProps;
//# sourceMappingURL=IconToggle.js.map