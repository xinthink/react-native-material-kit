const React = require('react-native');

const {
  View,
  } = React;

const Image = React.createClass({

  render() {
    return <View>{this.props.children}</View>;
  },

});

module.exports = Image;
