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
    this._animatedSize = new Animated.Value(0);
    this._animatedRadius = new Animated.Value(0);
    this._group = null;
    this.state = {
      checked: false,
    };
  }

  componentWillMount() {
    this.group = this.props.group;
    this._initView(this.props.checked);
  }

  componentWillReceiveProps(nextProps) {
    this.group = nextProps.group;
    if (nextProps.checked !== this.props.checked) {
      this._initView(nextProps.checked);
    }
  }

  _initView(checked) {
    this.setState({checked});
    this._aniChecked(checked)
  }

  // Touch events handling
  _onTouch(evt) {
    switch (evt.type) {
      case 'TOUCH_UP':
        if (!this.state.checked) {
          this.confirmToggle();
        }
        break;
    }
  }

  // When a toggle action (from the given state) is confirmed.
  confirmToggle() {
    const prevState = this.state.checked;
    const newState = !prevState;

    this.setState({checked: newState}, () => {
      if (this.props.onCheckedChange) {
        this.props.onCheckedChange({checked: this.state.checked});
      }
    });

    // update state of the other buttons in the group
    if (this.group) {
      this.group.onChecked(this, newState);
    }

    this._aniChecked.call(this, newState);
  }

  // animate the checked state, by scaling the inner circle
  _aniChecked(checked) {
    Animated.parallel([
      Animated.timing(this._animatedRadius, {
        toValue: checked ? 5 : 0,
        duration: 200,
      }),
      Animated.timing(this._animatedSize, {
        toValue: checked ? 10 : 0,
        duration: 200,
      }),
    ]).start();
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
            padding: 16,
          }}
          >
          <View ref="outerCircle"
                style={[
                  RadioButton.defaultProps.style, {
                    borderColor: MKColor.Indigo,
                  },
                  this.props.style,
                ]}
            >
            <Animated.View
              ref="innerCircle"
              style={{
                backgroundColor: MKColor.Indigo,
                width: this._animatedSize,
                height: this._animatedSize,
                borderRadius: this._animatedRadius,
              }}
            />
          </View>
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }
}

Object.defineProperty(RadioButton.prototype, 'group', {
  // Set the group of this radio
  set: function (group) {
    this._group = group;
    if (group) {
      group.add(this);
    }
  },
  // Retrieve the group of this radio
  get: function () {
    return this._group;
  },
  enumerable: true,
});

// ## <section id='props'>Props</section>
RadioButton.propTypes = {
  // [Ripple Props](Ripple.html#props)...
  ...Ripple.propTypes,

  // Touchable...
  ...TouchableWithoutFeedback.propTypes,

  // Toggle status
  checked: PropTypes.bool,

  // Group to which the Radio button belongs
  group: PropTypes.object,

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


//
// ## <section id='RadioButton'>RadioButton</section>
// The `RadioButton` component.
class Group {
  constructor() {
    this.buttons = [];
  }

  add(btn) {
    if (this.buttons.indexOf(btn) < 0) {
      this.buttons.push(btn);
    }
  }

  onChecked(btn, checked) {
    if (checked) {
      this.buttons.forEach((it) => it !== btn && it.confirmToggle());
    }
  }
}

// ## Public interface
module.exports = RadioButton;
RadioButton.Group = Group;
