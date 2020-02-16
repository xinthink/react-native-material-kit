/**
 * Created by ywu on 15/7/24.
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import {
  getTheme,
  MKColor,
  setTheme,
  Checkbox,
  IconToggle,
  RadioButton,
  RadioButtonGroup,
  Switch,
} from 'react-native-material-kit';

import appStyles from './styles';

// customize the material design theme
// setTheme({
//   primaryColor: MKColor.Amber,
//   primaryColorRGB: MKColor.RGBAmber,
//   accentColor: MKColor.Teal,
// });

//setTheme({radioStyle: {
//  fillColor: `rgba(${MKColor.RGBTeal},.8)`,
//  borderOnColor: `rgba(${MKColor.RGBTeal},.6)`,
//  borderOffColor: `rgba(${MKColor.RGBTeal},.3)`,
//  rippleColor: `rgba(${MKColor.RGBTeal},.15)`,
//}});

setTheme({
  checkboxStyle: {
    fillColor: MKColor.Amber,
    borderOnColor: MKColor.Amber,
    borderOffColor: `rgba(${MKColor.RGBAmber},.65)`,
    rippleColor: `rgba(${MKColor.RGBTeal},.15)`,
  },
});

const styles = Object.assign(
  {},
  appStyles,
  StyleSheet.create({
    toggleText: {
      fontSize: 16,
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#616161',
    },
    toggleOnText: {
      color: getTheme().primaryColor,
    },
    switch: {
      marginTop: 2,
      // marginBottom: 5,
    },
    appleSwitch: {
      marginTop: 7,
      marginBottom: 7,
    },
  })
);

class Toggles extends Component {
  constructor() {
    super();
    this.radioGroup = new RadioButtonGroup();
  }

  _onChecked(event) {
    console.log(`icon toggle is checked? ${event.checked}`);
  }

  _onToggleClicked() {
    console.log('you clicked a toggle');
  }

  render() {
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <IconToggle checked onCheckedChange={this._onChecked} onPress={this._onToggleClicked}>
              <Text stateChecked style={[styles.toggleText, styles.toggleOnText]}>
                T
              </Text>
              <Text style={styles.toggleText}>T</Text>
            </IconToggle>
            <Text style={styles.legendLabel}>Icon on</Text>
          </View>
          <View style={styles.col}>
            <IconToggle>
              <Text stateChecked style={[styles.toggleText, styles.toggleOnText]}>
                B
              </Text>
              <Text style={styles.toggleText}>B</Text>
            </IconToggle>
            <Text style={styles.legendLabel}>Icon off</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Switch checked style={styles.switch} />
            <Text style={styles.legendLabel}>Switch on</Text>
          </View>
          <View style={styles.col}>
            <Switch
              style={styles.appleSwitch}
              trackSize={30}
              trackLength={52}
              onColor="rgba(255,152,0,.3)"
              thumbOnColor={MKColor.Orange}
              rippleColor="rgba(255,152,0,.2)"
              onPress={() => console.log('orange switch pressed')}
              onCheckedChange={({ checked }) => console.log('orange switch checked:', checked)}
            />
            <Text style={styles.legendLabel}>Switch off</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <RadioButton checked={true} group={this.radioGroup} />
            <Text style={styles.legendLabel}>First</Text>
          </View>
          <View style={styles.col}>
            <RadioButton group={this.radioGroup} />
            <Text style={styles.legendLabel}>Second</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Checkbox checked />
            <Text style={styles.legendLabel}>Checked</Text>
          </View>
          <View style={styles.col}>
            <Checkbox />
            <Text style={styles.legendLabel}>Unchecked</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Toggles;
