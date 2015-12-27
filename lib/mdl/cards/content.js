const React = require('react-native');
let styles = require('./styles');

const {
  PropTypes,
  View,
  Text,
} = React;

var Content = React.createClass({

  render(){
    if(this.props.children.type.displayName === "Text"){
        return <Text style={styles.content}>{this.props.children}</Text>
    }else{
      return <View>{this.props.children}</View>
    }

  },

})

module.exports = Content;
