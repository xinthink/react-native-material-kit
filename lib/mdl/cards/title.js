const React = require('react-native');
let styles = require('./styles');

const {
  PropTypes,
  View,
  Text,
} = React;

var Title = React.createClass({

  render(){
      return <Text style={styles.title}>{this.props.children}</Text>      
  },

})

module.exports = Title;
