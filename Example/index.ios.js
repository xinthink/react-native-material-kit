/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  NavigatorIOS,
  TouchableOpacity,
  } = React;

var Buttons = require('./App/buttons');
var TextFields = require('./App/textfields');
var Toggles = require('./App/toggles');

var Home = React.createClass({
  render: function () {
    return (
      <ScrollView style={styles.list}
                  contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => {
          this.props.navigator.push({
            title: 'Buttons',
            component: Buttons,
          });
        }}>
          <Text style={styles.pushLabel}>Buttons</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.navigator.push({
            title: 'Text Fields',
            component: TextFields,
          });
        }}>
          <Text style={styles.pushLabel}>Text Fields</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.navigator.push({
            title: 'Toggles',
            component: Toggles,
          });
        }}>
          <Text style={styles.pushLabel}>Toggles</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
});

var Example = React.createClass({
  render: function () {
    return (
      <NavigatorIOS
        style={{flex:1}}
        initialRoute={{
          component: Home,
          title: 'Examples',
        }}
      />
    );
  },
});

var styles = StyleSheet.create({
  list: {
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
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
  pushLabel: {
    padding: 10,
    color: '#2196F3',
  }
});

AppRegistry.registerComponent('Example', () => Example);
