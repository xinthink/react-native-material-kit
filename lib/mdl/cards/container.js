const React = require('react-native');
let styles = require('./styles');

const {
  PropTypes,
  View,
} = React;

var Container = React.createClass({

  render(){
  	return (
  		<View style={styles.card}>
  			{this.props.children}
  		</View>
  	)
  },
})

module.exports = Container;
