const React = require('react-native');
const styles = require('./styles');

const {
  Text,
  } = React;

const Title = React.createClass({

  render() {
    return <Text style={styles.title}>{this.props.children}</Text>
  },

});

module.exports = Title;
