//
// MDL-style Radio button component.
//
// - @see [MDL Radio Button](http://www.getmdl.io/components/index.html#toggles-section/radio)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/10/12.
//
const React = require('react-native');

const {
  Component,
  TouchableWithoutFeedback,
  View,
  Animated,
  PropTypes,
} = React;

const MKColor = require('../MKColor');
const Ripple = require('./Ripple');
const utils = require('../utils');
const {getTheme} = require('../theme');

//
// ## <section id='RadioButton'>RadioButton</section>
// The `RadioButton` component.
class RadioButton extends Component {
  constructor(props) {
    super(props);
    this._animatedScale = new Animated.Value(0);
    this.state = { checked: false };
  }

  componentWillMount() {
    this.setState({checked: this.props.checked});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.props.checked) {
      this.setState({checked: nextProps.checked});
    }
  }

  // Touch events handling
  _onTouch(evt) {
    switch (evt.type) {
      case 'TOUCH_UP':
        this.confirmToggle();
        break;
    }
  }

  // When a toggle action (from the given state) is confirmed.
  confirmToggle() {
    const prevState = this.state.checked;
    this.setState({checked: !prevState}, () => {
      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({checked: this.state.checked});
      }
    });

    Animated.timing(this._animatedScale, {
      toValue: prevState ? 0 : 1,
      duration: 200,
    }).start();
  }

  render() {
    const rippleColor = this.props.rippleColor || `rgba(${getTheme().RGBPrimaryColor},.2)`;

    return (
      <TouchableWithoutFeedback {...utils.extractTouchableProps(this)}>
        <Ripple
          {...this.props}
          maskBorderRadiusInPercent={50}
          rippleLocation="center"
          rippleColor={rippleColor}
          onTouch={this._onTouch.bind(this)}
          style={{
            //backgroundColor: MKColor.Lime,
            padding: 16,
          }}
          >
          <View ref="outerCircle"
                style={[
                  RadioButton.defaultProps.style, {
                    borderColor: MKColor.Indigo, //getTheme().primaryColor,
                  },
                  this.props.style,
                ]}
            >
            <Animated.View
              ref="innerCircle"
              style={{
                backgroundColor: MKColor.Indigo,
                width: 10,
                height: 10,
                borderRadius: 5,
                transform: [
                  {scale: this._animatedScale},
                ],
              }}
            />
          </View>
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }
}

// ## <section id='props'>Props</section>
RadioButton.propTypes = {
  // [Ripple Props](Ripple.html#props)...
  ...Ripple.propTypes,

  // Touchable...
  ...TouchableWithoutFeedback.propTypes,

  // Toggle status
  checked: PropTypes.bool,

  // Callback when the toggle status is changed
  onCheckedChange: PropTypes.func,
};

// ## <section id='defaults'>Defaults</section>
RadioButton.defaultProps = {
  pointerEvents: 'box-only',
  maskColor: MKColor.Transparent,
  style: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    //margin: 22,
    borderWidth: 2,
    borderRadius: 10,
  },
};


// ## Public interface
module.exports = RadioButton;
