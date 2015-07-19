/**
 * Created by ywu on 15/7/16.
 */
'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} = React;

var {
  MKButton,
  MKColor,
} = MK;

// customize the material design theme
// MK.setTheme({
//   primaryColor: MKColor.Teal,
//   accentColor: MKColor.Purple,
// });

var Buttons = React.createClass({
  render: function() {
    var ColoredRaisedButton = MKButton.coloredButton()
      .withText('BUTTON')
      .withOnPress(() => {
        console.log("Hi, it's a colored button!");
      })
      .build();
    var AccentColoredRaisedButton = MKButton.accentColoredButton()
      .build();
    var PlainRaisedButton = MKButton.button()
      .withText('BUTTON')
      .build();
    var FlatButton = MKButton.flatButton()
      .withText('BUTTON')
      .build();
    var ColoredFlatButton = MKButton.coloredFlatButton()
      .withText('BUTTON')
      .build();
    var AccentColoredFlatButton = MKButton.accentColoredFlatButton()
      .withText('BUTTON')
      .build();

    var ColoredFab = MKButton.coloredFab()
      .withStyle(styles.fab)
      .withCornerRadius(21)  // cannot get style by id since react-native 0.7, set corner radius explicitly
      .build();
    var AccentColoredFab = MKButton.accentColoredFab()
      .withStyle(styles.fab)
      .withCornerRadius(21)  // cannot get style by id since react-native 0.7, set corner radius explicitly
      .build();
    var PlainFab = MKButton.plainFab()
      .withStyle(styles.fab)
      .withCornerRadius(21)  // cannot get style by id since react-native 0.7, set corner radius explicitly
      .build();

    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <PlainRaisedButton/>
            <Text style={styles.legendLabel}>Raised button</Text>
          </View>
          <View style={styles.col}>
            <ColoredRaisedButton/>
            <Text style={styles.legendLabel}>Colored</Text>
          </View>
          <View style={styles.col}>
            <AccentColoredRaisedButton>
              <Text pointerEvents="none" style={styles.buttonText}>BUTTON</Text>
            </AccentColoredRaisedButton>
            <Text style={styles.legendLabel}>Accent colored</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <PlainFab>
              <Image pointerEvents="none" source={require('image!plus-dark')} />
            </PlainFab>
            <Text style={styles.legendLabel}>Plain FAB</Text>
          </View>
          <View style={styles.col}>
            <ColoredFab>
              <Image pointerEvents="none" source={require('image!plus-white')} />
            </ColoredFab>
            <Text style={styles.legendLabel}>Colored</Text>
          </View>
          <View style={styles.col}>
            <AccentColoredFab>
              <Image pointerEvents="none" source={require('image!plus-white')} />
            </AccentColoredFab>
            <Text style={styles.legendLabel}>Accent colored</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <FlatButton/>
            <Text style={styles.legendLabel}>Flat button</Text>
          </View>
          <View style={styles.col}>
            <ColoredFlatButton/>
            <Text style={styles.legendLabel}>Colored</Text>
          </View>
          <View style={styles.col}>
            <AccentColoredFlatButton/>
            <Text style={styles.legendLabel}>Accent colored</Text>
          </View>
        </View>
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
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  fab: {
    width: 42, height: 42,
  }
});

module.exports = Buttons;