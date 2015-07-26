/**
 * Created by ywu on 15/7/24.
 */

const React = require('react-native');
const MK = require('react-native-material-kit');

const {
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
} = React;

const {
  MKIconToggle,
  MKColor,
} = MK;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 7, marginRight: 7,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 10, marginBottom: 20,
  },
  legendLabel: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 10, marginBottom: 20,
    fontSize: 12,
  },
  toggleText: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#616161',
  },
  toggleOnText: {
    //fontStyle: 'normal',
    color: MKColor.Indigo,
  },
});

class Toggles extends Component {
  _onChecked(event) {
    console.log(`icon toggle is checked? ${event.checked}`);
  }

  _onToggleClicked() {
    console.log('you clicked a toggle');
  }

  render() {
    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <MKIconToggle
              checked={true}
              onCheckedChange={this._onChecked}
              onPress={this._onToggleClicked}
              >
              <Text state_checked={true}
                    pointerEvents="none"
                    style={[styles.toggleText, styles.toggleOnText]}>T</Text>
              <Text pointerEvents="none"
                    style={styles.toggleText}>T</Text>
            </MKIconToggle>
            <Text style={styles.legendLabel}>Icon toggle</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

module.exports = Toggles;
