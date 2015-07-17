/**
 * Created by ywu on 15/7/16.
 */
'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
} = React;

var {
  MKTextField,
  MKColor,
} = require('react-native-material-kit');

var TextFields = React.createClass({
  render: function() {
    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <MKTextField
          style={[styles.textField, {
            backgroundColor: '#E0E0E0',
          }]}
          placeholder="Hint text"
          />
        <MKTextField
          style={styles.textField}
          placeholder="Floating hint"
          cornerRadius={0}
          tintColor={MKColor.Blue}
          rippleLayerColor={MKColor.LightBlue}
          rippleLocation="right"
          floatingPlaceholderEnabled={true}
          />
        <MKTextField
          style={[styles.textField, {
            borderWidth: 1,
            borderColor: MKColor.Green,
          }]}
          placeholder="Floating hint"
          cornerRadius={1}
          tintColor={MKColor.LightGreen}
          rippleLayerColor={MKColor.LightGreen}
          rippleLocation="left"
          floatingPlaceholderEnabled={true}
          />
        <MKTextField
          style={styles.textField}
          placeholder="Floating hint"
          cornerRadius={1}
          tintColor={MKColor.Cyan}
          rippleLayerColor={MKColor.Teal}
          floatingPlaceholderEnabled={true}
          floatingLabelTextColor={MKColor.Teal}
          bottomBorderEnabled={true}
          bottomBorderColor={MKColor.Teal}
          />
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 20, marginBottom: 0,
  },
  button: {
    width: 200,
    marginTop: 25,
    paddingLeft: 25, paddingRight: 25,
    paddingTop: 15, paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatButton: {
    marginTop: 25,
    width: 48, height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPlus: {
    fontFamily: 'Arial',
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  textField: {
    width: 200,
    marginTop: 18,
    height: 36,
    borderWidth: 0,
  },
});

module.exports = TextFields;