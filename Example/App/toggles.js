/**
 * Created by ywu on 15/7/24.
 */

const React = require('react-native');
const MK = require('react-native-material-kit');
const appStyles = require('./styles');

const {
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
} = React;

const {
  MKIconToggle,
  MKSwitch,
  MKColor,
} = MK;

const styles = Object.assign(appStyles, StyleSheet.create({
  toggleText: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#616161',
  },
  toggleOnText: {
    color: MKColor.Indigo,
  },
  switch: {
    marginTop: 5,
  },
  appleSwitch: {
    width: 40, height: 22,
    marginBottom: 5,
  },
}));

class Toggles extends Component {
  _onChecked(event) {
    console.log(`icon toggle is checked? ${event.checked}`);
  }

  _onToggleClicked() {
    console.log('you clicked a toggle');
  }

  render() {
    const CheckedIconToggle = MKIconToggle.toggle()
      .withChecked(true)
      .withOnCheckedChange(this._onChecked)
      .withOnPress(this._onToggleClicked)
      .build();

    const OrangeAppleSwitch = MKSwitch.mkSwitch()
      .withStyle(styles.appleSwitch)
      .withOnColor('rgba(255,152,0,.3)')
      .withThumbOnColor(MKColor.Orange)
      .withRippleLayerColor('rgba(255,152,0,.2)')
      .withOnCheckedChange(() => console.log('orange switch clicked'))
      .build();

    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <CheckedIconToggle>
              <Text state_checked={true}
                    pointerEvents="none"
                    style={[styles.toggleText, styles.toggleOnText]}>T</Text>
              <Text pointerEvents="none"
                    style={styles.toggleText}>T</Text>
            </CheckedIconToggle>
            <Text style={styles.legendLabel}>Icon on</Text>
          </View>
          <View style={styles.col}>
            <MKIconToggle>
              <Text state_checked={true}
                    pointerEvents="none"
                    style={[styles.toggleText, styles.toggleOnText]}>B</Text>
              <Text pointerEvents="none"
                    style={styles.toggleText}>B</Text>
            </MKIconToggle>
            <Text style={styles.legendLabel}>Icon off</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <MKSwitch
              checked={true}
              onCheckedChange={this._onChecked}
              onPress={this._onToggleClicked}
              style={styles.switch}
            />
            <Text style={styles.legendLabel}>Switch on</Text>
          </View>
          <View style={styles.col}>
            <OrangeAppleSwitch/>
            <Text style={styles.legendLabel}>Switch off</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

module.exports = Toggles;
