const React = require('react-native');
const styles = require('./styles');

const {
  View,
  } = React;

const Container = React.createClass({

  render() {
    return (
      <View style={styles.card}>
        {this.props.children}
      </View>
    )
  },
});

module.exports = Container;
