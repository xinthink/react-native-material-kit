const React = require('react-native');
let styles = require('./styles');

const {
  PropTypes,
  View,
} = React;

var Action = React.createClass({

  render(){
    return <View style={styles.action}>{this.props.content}</View>
  },

})

module.exports = Action;
