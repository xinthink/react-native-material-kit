/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import { setTheme, MKColor } from 'react-native-material-kit';

// customize the material design theme
// setTheme({
//   primaryColor: MKColor.Purple,
//   primaryColorRGB: MKColor.RGBPurple,
//   accentColor: MKColor.Amber,
// });

import Buttons from './buttons';
import TextFields from './textfields';
import Toggles from './toggles';
import Progress from './progress';
import Sliders from './sliders';
import Cards from './cards';

const Home = props => (
  <ScrollView style={styles.list} contentContainerStyle={styles.container}>
    <TouchableOpacity onPress={() => navigate(props, 'Buttons')}>
      <Text style={styles.pushLabel}>Buttons</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigate(props, 'Cards')}>
      <Text style={styles.pushLabel}>Cards</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigate(props, 'Progress')}>
      <Text style={styles.pushLabel}>Loading</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigate(props, 'Sliders')}>
      <Text style={styles.pushLabel}>Sliders</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigate(props, 'Textfields')}>
      <Text style={styles.pushLabel}>Text Fields</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigate(props, 'Toggles')}>
      <Text style={styles.pushLabel}>Toggles</Text>
    </TouchableOpacity>
  </ScrollView>
);

const Stack = createStackNavigator();

function navigate(props, route, params, action) {
  props.navigation.navigate(route, params, action);
}

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ title: 'Examples' }} />
      <Stack.Screen name="Buttons" component={Buttons} options={{ title: 'Buttons' }} />
      <Stack.Screen name="Cards" component={Cards} options={{ title: 'Cards' }} />
      <Stack.Screen name="Progress" component={Progress} options={{ title: 'Progress' }} />
      <Stack.Screen name="Sliders" component={Sliders} options={{ title: 'Sliders' }} />
      <Stack.Screen name="Toggles" component={Toggles} options={{ title: 'Toggles' }} />
      <Stack.Screen name="Textfields" component={TextFields} options={{ title: 'Text Fields' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  list: {
    backgroundColor: '#F5FCFF',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
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
    marginTop: 20,
    marginBottom: 0,
  },
  pushLabel: {
    padding: 10,
    color: '#2196F3',
  },
});

export default App;
