
const React = require('react-native');
const MKColor = require('../MKColor');
const {getTheme} = require('../theme');

const {
  Component,
  PropTypes,
  View, 
  Text,
  Image,
  StyleSheet
} = React;

var style = StyleSheet.create({
	image : {
		flex : 1,
		height : 170,
		resizeMode: 'cover'
	},
	title : {
		position : "absolute",
		top : 120,
		left : 26,
		backgroundColor: 'transparent',
		padding : 16,
		fontSize : 24,
		color : "#ffffff",
		fontWeight: 'bold',
	},
	content : {
		padding : 15,
		
	},
	action : {
		borderStyle:"solid",
		borderTopColor : "rgba(0,0,0,.1)",
		borderTopWidth : 1,
		padding : 15,
		
	},
	menu : {
		position : "absolute",
		top : 16,
		right : 16,
		backgroundColor : "transparent",
		
	}
});

class Card extends Component {
  constructor(props) {
    super(props);
    
  }

  render(){
  	return (
  		<View style={this.props.style}>
  			<Image source={this.props.backgroundImage} style={style.image} />
  			<Text style={style.title}>{this.props.title}</Text>
  			<View style={style.content}>
  				{this.props.content}
  			</View>
  			<View style={style.action}>
  				{this.props.action}
  			</View>
  			<View style={style.menu}>
  				{this.props.menu}
  			</View>
  		</View>
  	)
  }
}

Card.propTypes = {
  backgroundImage : Image.propTypes.source,
  title : PropTypes.string,
  content : PropTypes.node,
  menu : PropTypes.node,
  action : PropTypes.node
  
};

// ## <section id='defaults'>Defaults</section>
Card.defaultProps = {
  // backgroundImage: {},
  // title : "",
  // content : "",
  // menu : '',
  // action : ''
};
module.exports = Card;