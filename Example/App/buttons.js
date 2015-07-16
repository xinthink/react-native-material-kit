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
  MKButton,
} = require('react-native-material-kit');

var Buttons = React.createClass({
  render: function() {
    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <MKButton
          backgroundColor={"#3E50B4"}
          cornerRadius={3.0}
          shadowRadius={3.0}
          shadowOpacity={0.55}
          shadowColor="gray"
          shadowOffset={{width:0, height:2.5}}
          style={styles.button}
          >
          <Text pointerEvents="none" style={{color: 'white'}}>
            RAISED BUTTON
          </Text>
        </MKButton>
        <MKButton
          backgroundLayerColor={"cyan"}
          cornerRadius={3.0}
          backgroundColor={'rgba(0, 0, 0, 0)'}
          shadowRadius={3.0}
          shadowOpacity={0.5}
          shadowColor="black"
          shadowOffset={{width:0, height:2.5}}
          style={styles.button}
          >
          <Text pointerEvents="none" style={{fontWeight: 'bold', color: '#3E50B4'}}>
            FLAT BUTTON
          </Text>
        </MKButton>
        <MKButton
          backgroundAniEnabled={false}
          maskEnabled={false}
          ripplePercent={0.3}
          rippleLocation={'center'}
          rippleAniTimingFunction={'easeOut'}
          style={[styles.button, {marginTop: 15}]}
          >
          <Text pointerEvents="none" style={{fontWeight: 'bold', color: 'chartreuse'}}>
            FLAT BUTTON
          </Text>
        </MKButton>
        <MKButton
          backgroundColor={"#009688"}
          cornerRadius={24}
          shadowRadius={3.5}
          shadowOpacity={0.75}
          shadowColor="black"
          shadowOffset={{width:1, height:5.5}}
          style={styles.floatButton}
          >
          <Text pointerEvents="none" style={styles.textPlus}>
            +
          </Text>
        </MKButton>
        <MKButton
          backgroundColor={"#EF4481"}
          cornerRadius={24}
          backgroundLayerCornerRadius={24}
          maskEnabled={false}
          ripplePercent={1.75}
          rippleLocation={'center'}
          shadowRadius={3.5}
          shadowOpacity={0.75}
          shadowColor="black"
          shadowOffset={{width:1, height:5.5}}
          style={styles.floatButton}
          >
          <Text pointerEvents="none" style={styles.textPlus}>
            +
          </Text>
        </MKButton>
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
});

module.exports = Buttons;