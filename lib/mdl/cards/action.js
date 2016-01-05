const React = require('react-native');
const styles = require('./styles');

const {
  View,
  } = React;

const Action = React.createClass({

  render() {
    return <View style={styles.action}>{this.props.content}</View>;
  },

});

module.exports = Action;
