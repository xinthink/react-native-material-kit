/**
 * Created by ywu on 15/6/3.
 */

const React = require('react-native');
const {
  requireNativeComponent,
  TouchableWithoutFeedback,
} = React;

const MKPropTypes = require('./MKPropTypes');
const MKColor = require('./MKColor');
const getTheme = require('./theme').getTheme;
const utils = require('./utils');


/**
 * Material design button
 */
class MKButton extends React.Component {
  render() {
    const touchableProps = {};
    if (!this.props.disabled) {
      Object.assign(touchableProps, {
        onPress: this.props.onPress,
        onPressIn: this.props.onPressIn,
        onPressOut: this.props.onPressOut,
        onLongPress: this.props.onLongPress,
      });
    }

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <NativeButton {...this.props} />
      </TouchableWithoutFeedback>
    );
  }
}

MKButton.propTypes = {
  ...MKPropTypes.mkLayerPropTypes,
  ...TouchableWithoutFeedback.propTypes,
  disabled: React.PropTypes.bool,
};

const NativeButton = requireNativeComponent('MKButton', MKButton);


// --------------------------
// builders
//
const {
  TextViewBuilder,
} = require('./builder');

/**
 * Button builder
 */
class MKButtonBuilder extends TextViewBuilder {
  withFab(fab) {
    this.fab = fab;
    return this;
  }

  mergeStyle() {
    super.mergeStyle();
    if (this.fab) {
      this.styleFab();
    }
  }

  // merge default FAB style with custom setting
  styleFab() {
    this.style = [{
      width: utils.toPixels(24),
      height: utils.toPixels(24),
      borderRadius: utils.toPixels(12),
    }, this.style];
  }

  build() {
    const theBuilder = this;
    const props = this.toProps();

    return React.createClass({
      render: function () {
        // use a text or a custom content
        const ChildTag = theBuilder.text ? (
          <React.Text pointerEvents="none" style={theBuilder.textStyle || {}}>
            {theBuilder.text}
          </React.Text>
        ) : this.props.children;

        return (
          <MKButton {...Object.assign({}, props, this.props)}>
            {ChildTag}
          </MKButton>
        );
      },
    });
  }
}

/**
 * Built-in button builders
 */
function coloredRaisedButton() {
  return new MKButtonBuilder()
    .withShadowRadius(2)
    .withShadowOffset({width: 0, height: 2})
    .withShadowOpacity(.7)
    .withShadowColor('black')
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
    //.withShadowPathEnabled(true)
    //.withShadowOffset({width:.3, height:0})
    .withBackgroundColor(MKColor.Silver)
    .withBackgroundLayerColor(getTheme().bgPlain)
    .withRippleLayerColor(getTheme().bgPlain)
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
}

function flatButton() {
  return new MKButtonBuilder()
    .withBackgroundColor(MKColor.Transparent)
    .withBackgroundLayerColor(getTheme().bgPlain)
    .withRippleLayerColor(getTheme().bgPlain)
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
}

function coloredFlatButton() {
  return flatButton()
    .withRippleLayerColor('rgba(255,255,255,0.2)')
    .withTextStyle({
      color: getTheme().primaryColor,
      fontWeight: 'bold',
    });
}

function accentColoredFlatButton() {
  return flatButton()
    .withRippleLayerColor('rgba(255,255,255,0.2)')
    .withTextStyle({
      color: getTheme().accentColor,
      fontWeight: 'bold',
    });
}

function coloredFab() {
  return coloredRaisedButton()
    .withFab(true)
    .withRippleLocation('center');
}

function accentColoredFab() {
  return coloredFab().withAccent(true);
}

function plainFab() {
  // FIXME doesn't support translucent bg, has shadow problems
  return coloredFab()
    .withBackgroundLayerColor(getTheme().bgPlain)
    .withRippleLayerColor(getTheme().bgPlain)
    .withBackgroundColor(MKColor.Silver);
}


module.exports = MKButton;

MKButton.Builder = MKButtonBuilder;
MKButton.button = plainRaisedButton;
MKButton.coloredButton = coloredRaisedButton;
MKButton.accentColoredButton = accentColoredRaisedButton;
MKButton.flatButton = flatButton;
MKButton.coloredFlatButton = coloredFlatButton;
MKButton.accentColoredFlatButton = accentColoredFlatButton;
MKButton.plainFab = plainFab;
MKButton.coloredFab = coloredFab;
MKButton.accentColoredFab = accentColoredFab;
