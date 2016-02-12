//
// MDL-style Icon Toggle component.
//
// - @see [MDL Icon Toggle](http://bit.ly/1OUYzem)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/10/07.
//

const React = require('react-native');

const {
  Component,
  TouchableWithoutFeedback,
} = React;

const MKColor = require('../MKColor');
const Ripple = require('./Ripple');
const utils = require('../utils');
const {getTheme} = require('../theme');


function isViewForState(view, state) {
  return (view.props.state_checked && state) ||
    !(view.props.state_checked || state);
}

//
// ## <section id='IconToggle'>IconToggle</section>
// The `IconToggle` component.
class IconToggle extends Component {
  constructor(props) {
    super(props);
    this.theme = getTheme();
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
  }

  // Select a child element to show for the current toggle status.
  //
  // @see [State List](http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList) in Android development
  _renderChildren() {
    return React.Children.map(this.props.children,
      (child) => isViewForState(child, this.state.checked) ? child : null);
  }

  render() {
    const mergedStyle = Object.assign({}, this.theme.iconToggleStyle, utils.compact({
      rippleColor: this.props.rippleColor,
    }));

    return (
      <TouchableWithoutFeedback {...utils.extractTouchableProps(this)}>
        <Ripple
          {...this.props}
          rippleColor={mergedStyle.rippleColor}
          style={[IconToggle.defaultProps.style, this.props.style]}
          maskBorderRadiusInPercent={50}
          rippleLocation="center"
          onTouch={this._onTouch.bind(this)}
          >
          {this._renderChildren()}
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }
}

// ## <section id='props'>Props</section>
IconToggle.propTypes = {
  // [Ripple Props](Ripple.html#props)...
  ...Ripple.propTypes,

  // Touchable...
  ...TouchableWithoutFeedback.propTypes,

  // Toggle status
  checked: React.PropTypes.bool,

  // Callback when the toggle status is changed
  onCheckedChange: React.PropTypes.func,
};

// ## <section id='defaults'>Defaults</section>
IconToggle.defaultProps = {
  pointerEvents: 'box-only',
  enabled: true,
  maskColor: MKColor.Transparent,
  style: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,.54)',
    width: 56,
    height: 56,
  },
};


// --------------------------
// Builder
//
const {
  Builder,
} = require('../builder');

//
// ## Toggle builder
//
class IconToggleBuilder extends Builder {
  build() {
    const props = this.toProps();

    return React.createClass({
      render: function () {
        return (
          <IconToggle {...Object.assign({}, props, this.props)}>
            {this.props.children}
          </IconToggle>
        );
      },
    });
  }
}

// define builder method for each prop
IconToggleBuilder.defineProps(IconToggle.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//
function builder() {
  return new IconToggleBuilder().withBackgroundColor(MKColor.Transparent);
}


// ## Public interface
module.exports = IconToggle;
IconToggle.Builder = IconToggleBuilder;
IconToggle.builder = builder;
