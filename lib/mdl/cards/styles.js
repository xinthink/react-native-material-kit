const React = require('react-native');

const {
  StyleSheet,
  } = React;

// TODO: Plug colors etc with MKTheme
const style = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#ffffff',
    borderWidth: 10,

    shadowColor: 'rgba(0,0,0,.12)',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 2,
    },
  },
  image: {
    flex: 1,
    height: 170,
    resizeMode: 'cover',
  },
  title: {
    position: 'absolute',
    top: 120,
    left: 26,
    backgroundColor: 'transparent',
    padding: 16,
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
    color: 'rgba(0,0,0,.54)',
  },
  action: {
    borderStyle: 'solid',
    borderTopColor: 'rgba(0,0,0,.1)',
    borderTopWidth: 1,
    padding: 15,

  },
  menu: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'transparent',

  },
});

module.exports = style;
