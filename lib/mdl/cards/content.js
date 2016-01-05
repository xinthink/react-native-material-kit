const React = require('react-native');
const styles = require('./styles');

const {
  View,
  Text,
  } = React;

const Content = React.createClass({

  render() {
    if (this.props.children.type.displayName === 'Text') {
      return <Text style={styles.content}>{this.props.children}</Text>
    } else {
      return <View>{this.props.children}</View>
    }

  },

});

module.exports = Content;
