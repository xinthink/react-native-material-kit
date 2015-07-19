/**
 * Created by ywu on 15/6/3.
 */
'use strict';

var React = require('react-native');
var {
  requireNativeComponent,
  TouchableWithoutFeedback,
} = React;

var MKPropTypes = require('./MKPropTypes');
var MKColor = require('./MKColor');
var getTheme = require('./theme').getTheme;
var utils = require('./utils');


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

var NativeButton = requireNativeComponent('MKButton', MKButton);


// --------------------------
// builders
//
var {
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
      var size = Math.min(this.style.width || 0, this.style.height || 0);
      this.style.width = this.style.height = size;
      this.withCornerRadius(size / 2);
    }

    if (this.cornerRadius <= 0) {
      console.warn('to build FABs correctly, width/height is required in style (object style, NOT stylesheet), or specify a cornerRadius');
    }
  }

  build() {
    var theBuilder = this;
    var props = this.toProps();
    //console.log(props);

    return React.createClass({
      render: function () {
        // use a text or a custom content
        var ChildTag = theBuilder.text ? (
          <React.Text pointerEvents="none" style={theBuilder.textStyle || {}}>
            {theBuilder.text}
          </React.Text>
        ): this.props.children;

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
var coloredRaisedButton = () => {
  return new MKButtonBuilder()
    .withShadowRadius(2)
    .withShadowOffset({width:0, height:2})
    .withShadowOpacity(.7)
    .withShadowColor('black')
    .withTextStyle({
      color: 'white',
      fontWeight: 'bold',
    });
};

var accentColoredRaisedButton = () => {
  return coloredRaisedButton().withAccent(true);
};

var plainRaisedButton = () => {
  // FIXME doesn't support translucent bg, has shadow problems
  return coloredRaisedButton()
    //.withBackgroundColor(getTheme().bgPlain)
    //.withShadowPathEnabled(true)
    //.withShadowOffset({width:.3, height:0})
    .withBackgroundColor(MKColor.Silver)
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
};

var flatButton = () => {
  return new MKButtonBuilder()
    .withBackgroundColor(MKColor.Transparent)
    .withBackgroundLayerColor(getTheme().bgPlain)
    .withTextStyle({
      color: 'black',
      fontWeight: 'bold',
    });
};

var coloredFlatButton = () => {
  return flatButton()
    .withTextStyle({
      color: getTheme().primaryColor,
      fontWeight: 'bold',
    });
};

var accentColoredFlatButton = () => {
  return flatButton()
    .withTextStyle({
      color: getTheme().accentColor,
      fontWeight: 'bold',
    });
};

var coloredFab = () => {
  return coloredRaisedButton()
    .withFab(true)
    .withRippleLocation('center');
};

var accentColoredFab = () => {
  return coloredFab().withAccent(true);
};

var plainFab = () => {
  // FIXME doesn't support translucent bg, has shadow problems
  return coloredFab()
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
