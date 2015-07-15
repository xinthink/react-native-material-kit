/**
 * Created by ywu on 15/6/3.
 */
'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;
var MKPropTypes = require('./MKPropTypes');

class MKButton extends React.Component {
  render() {
    return <NativeButton {...this.props} />;
  }
}

MKButton.propTypes = {
  ...MKPropTypes,
};

var NativeButton = requireNativeComponent('MKButton', MKButton);

module.exports = MKButton;