const React = require('react-native');
let styles = require('./styles');

const {
  PropTypes,
  View,
  Text,
} = React;

var Menu = React.createClass({

  render(){
    return this.props.children
  },

})

module.exports = Menu;
