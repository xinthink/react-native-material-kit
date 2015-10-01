const React = require('react-native');
let styles = require('./styles');

const {
  PropTypes,
  View,
  Image,
} = React;

var Imag = React.createClass({

  render(){
    console.log(this.props);
    return <View>{this.props.children}</View>;
  },

})

module.exports = Imag;
