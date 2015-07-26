/**
 * Created by ywu on 15/7/16.
 */
'use strict';

var React = require('react-native');
var MK = require('react-native-material-kit');
var appStyles = require('./styles');

var {
  StyleSheet,
  Text,
  View,
  ScrollView,
} = React;

var {
  setTheme,
  MKTextField,
  MKColor,
} = MK;

var styles = Object.assign(appStyles, StyleSheet.create({
  textfield: {
    width: 80,
    marginTop: 18,
    height: 28,
  },
  textfieldWithFloatingLabel: {
    width: 80,
    marginTop: 18,
    height: 38,
  },
}));

var TextFields = React.createClass({
  render: function() {

    var Textfield = MKTextField.textfield()
      .withPlaceholder('Text...')
      .withStyle(styles.textfield)
      .build();

    var TextfieldWithFloatingLabel = MKTextField.textfieldWithFloatingLabel()
      .withPlaceholder('Text...')
      .withStyle(styles.textfieldWithFloatingLabel)
      .build();

    var TextfieldWithRipple = MKTextField.textfieldWithRipple()
      .withPlaceholder('Text...')
      .withStyle(styles.textfield)
      .build();

    var TextfieldWithRippleAndFloatingLabel = MKTextField.textfieldWithRippleAndFloatingLabel()
      .withPlaceholder('Text...')
      .withStyle(styles.textfieldWithFloatingLabel)
      .build();

    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Textfield/>
            <Text style={styles.legendLabel}>Textfield</Text>
          </View>
          <View style={styles.col}>
            <TextfieldWithRipple/>
            <Text style={styles.legendLabel}>With ripple</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <TextfieldWithFloatingLabel/>
            <Text style={styles.legendLabel}>With floating label</Text>
          </View>
          <View style={styles.col}>
            <TextfieldWithRippleAndFloatingLabel/>
            <Text style={styles.legendLabel}>Ripple + floating label</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
});

module.exports = TextFields;
