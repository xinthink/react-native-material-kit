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
    var touchableProps = {};
    if (!this.props.disabled) {
      touchableProps.onPress = this.props.onPress;
      touchableProps.onPressIn = this.props.onPressIn;
      touchableProps.onPressOut = this.props.onPressOut;
      touchableProps.onLongPress = this.props.onLongPress;
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

  styleFab() {
    if (this.style && !utils.isNumber(this.style)
        && (this.style.width > 0 || this.style.height > 0)) {
      // cannot get style by id since 0.7, use style object or explicit corner radius
      const size = Math.min(this.style.width || 0, this.style.height || 0);
      this.style.width = this.style.height = size;
      this.withCornerRadius(size / 2);
    }

    if (this.cornerRadius <= 0) {
      console.warn('to build FABs correctly, width/height is required in style or specify a cornerRadius');
    }
  }

  build() {
    const theBuilder = this;
    const props = this.toProps();
    //console.log(props);

    return React.createClass({
      render: function () {
        // use a text or a custom content
        const ChildTag = theBuilder.text ? (
          <React.Text pointerEvents="none" style={theBuilder.textStyle || {}}>
            {theBuilder.text}
          </React.Text>
        ) : this.props.children;

        return (
          <MKButton {...props}>
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
