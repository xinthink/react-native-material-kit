//
// MDL-style Button component.
//
// - @see [MDL Button](http://www.getmdl.io/components/index.html#buttons-section)
// - [Props](#props)
// - [Defaults](#defaults)
// - [Built-in builders](#builders)
//
// Created by ywu on 15/7/2.
//
const React = require('react-native');
const MKColor = require('../MKColor');
const Ripple = require('./Ripple');
const utils = require('../utils');
const {getTheme} = require('../theme');

const {
  Component,
  TouchableWithoutFeedback,
  PropTypes,
} = React;

//
// ## <section id='Button'>Button</section>
// The `Button` component. With configurable shadow, ripple effect, and FAB style.
//
class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    requestAnimationFrame(this._doMeasurement.bind(this));
  }

  _doMeasurement() {
    this.refs.container.measure((x, y, width, height) => {
      this.setState({
        width,
        height,
      });
    });
  }

  _renderChildren() {
    return this.props.children;
  }

  render() {
    const touchableProps = {};
    if (this.props.enabled) {
      Object.assign(touchableProps, utils.extractTouchableProps(this));
    }

    const fabStyle = {};
    if (this.props.fab && (this.state.width > 0 || this.state.height)) {
      let size = Math.min(this.state.width, this.state.height);
      if (!size || size <= 0) {
        size = Math.max(this.state.width, this.state.height);
      }

      fabStyle.width = size;
      fabStyle.height = size;
      fabStyle.borderRadius = size / 2;
    }

    // FIXME mask.borderRadius should eql container's
    // but there's no api to retrieve styleSheet object, using default value
    const maskProps = {
      maskBorderRadius: fabStyle.borderRadius || utils.toPixels(1),
    };

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <Ripple ref="container"
                {...this.props}
                {...maskProps}
                style={[
                  this.props.style,
                  fabStyle,
                ]}
          >
          {this._renderChildren()}
        </Ripple>
      </TouchableWithoutFeedback>
    );
  }
}

// ## <section id='props'>Props</section>
Button.propTypes = {
  // [Ripple Props](Ripple.html#props)...
  ...Ripple.propTypes,

  // [RN.TouchableWithoutFeedback Props](https://facebook.github.io/react-native/docs/touchablewithoutfeedback.html#props)...
  ...TouchableWithoutFeedback.propTypes,

  // Whether this's a FAB
  fab: PropTypes.bool,

  // Whether the button is enabled
  enabled: PropTypes.bool,
};

// ## <section id='defaults'>Defaults</section>
Button.defaultProps = {
  // [Ripple defaults](Ripple.html#defaults)...
  ...Ripple.defaultProps,
  enabled: true,
};



// --------------------------
// Builder
//
const {TextViewBuilder} = require('../builder');

//
// ## Button builder
// - @see [TextViewBuilder](../builder.html#TextViewBuilder)
//
class ButtonBuilder extends TextViewBuilder {
  mergeStyle() {
    if (this.fab) {
      this.styleFab();
    }
    super.mergeStyle();
  }

  // merge default FAB style with custom setting
  styleFab() {
    this.mergeStyleWith({
      width: utils.toPixels(24),
      height: utils.toPixels(24),
      borderRadius: utils.toPixels(12),
    });
  }

  build() {
    const theBuilder = this;
    const props = this.toProps();

    const BuiltButton = class extends Button {
      _renderChildren() {
        // use a text or a custom content
        return theBuilder.text ? (
          <React.Text style={theBuilder.textStyle || {}}>
            {theBuilder.text}
          </React.Text>
        ) : this.props.children;
      }
    };
    BuiltButton.defaultProps = Object.assign({}, Button.defaultProps, props);
    return BuiltButton;
  }
}

// define builder method for each prop
ButtonBuilder.defineProps(Button.propTypes);


// ----------
// ## <section id="builders">Built-in builders</section>
//
function coloredRaisedButton() {
  return new ButtonBuilder()
    .withStyle({
      borderRadius: utils.toPixels(1),
      shadowRadius: utils.toPixels(.5),
      shadowOffset: {width: 0, height: utils.toPixels(.5)},
      shadowOpacity: .7,
      shadowColor: 'black',
    })
    .withTextStyle({
      color: 'white',
      fontWeight: 'bold',
    });
}

function accentColoredRaisedButton() {
  return coloredRaisedButton().withAccent(true);
}

function plainRaisedButton() {
  // FIXME doesn't support translucent bg, has shadow problems
  return coloredRaisedButton()
    //.withBackgroundColor(getTheme().bgPlain)
    .withBackgroundColor(MKColor.Silver)
    .withMaskColor(getTheme().bgPlain)
    .withRippleColor(getTheme().bgPlain)
    //.withStyle({
    //  shadowOffset: {width: 0.3, height: 0},
    //})
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
}

function flatButton() {
  return new ButtonBuilder()
    .withBackgroundColor(MKColor.Transparent)
    .withMaskColor(getTheme().bgPlain)
    .withRippleColor(getTheme().bgPlain)
    .withShadowAniEnabled(false)
    .withStyle({
      borderRadius: utils.toPixels(1),
    })
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
}

function coloredFlatButton() {
  return flatButton()
    .withRippleColor('rgba(255,255,255,0.2)')
    .withTextStyle({
      color: getTheme().primaryColor,
      fontWeight: 'bold',
    });
}

function accentColoredFlatButton() {
  return flatButton()
    .withRippleColor('rgba(255,255,255,0.2)')
    .withTextStyle({
      color: getTheme().accentColor,
      fontWeight: 'bold',
    });
}

function coloredFab() {
  return new ButtonBuilder()
    .withStyle({
      shadowRadius: utils.toPixels(.5),
      shadowOffset: {width: 0, height: utils.toPixels(.5)},
      shadowOpacity: .4,
      shadowColor: 'black',
    })
    .withFab(true)
    .withRippleLocation('center');
}

function accentColoredFab() {
  return coloredFab().withAccent(true);
}

function plainFab() {
  // FIXME doesn't support translucent bg, has shadow problems
  return coloredFab()
    .withMaskColor(getTheme().bgPlain)
    .withRippleColor(getTheme().bgPlain)
    .withBackgroundColor(MKColor.Silver);
}


// ## Public interface
module.exports = Button;

Button.Builder = ButtonBuilder;
Button.button = plainRaisedButton;
Button.coloredButton = coloredRaisedButton;
Button.accentColoredButton = accentColoredRaisedButton;
Button.flatButton = flatButton;
Button.coloredFlatButton = coloredFlatButton;
Button.accentColoredFlatButton = accentColoredFlatButton;
Button.plainFab = plainFab;
Button.coloredFab = coloredFab;
Button.accentColoredFab = accentColoredFab;
