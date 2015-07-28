/**
 * Created by ywu on 15/7/16.
 */

const React = require('react-native');
const MK = require('react-native-material-kit');
const appStyles = require('./styles');

const {
  StyleSheet,
  Text,
  View,
  ScrollView,
} = React;

const {
  MKTextField,
} = MK;

const styles = Object.assign(appStyles, StyleSheet.create({
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

const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .withOnFocus((e) => console.log('Focus', e))
  .withOnBlur((e) => console.log('Blur', e))
  .withOnEndEditing((e) => console.log('EndEditing', e))
  .withOnSubmitEditing((e) => console.log('SubmitEditing', e))
  .withOnTextChange((e) => console.log('TextChange', e))
  .build();

const TextfieldWithFloatingLabel = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Text...')
  .withStyle(styles.textfieldWithFloatingLabel)
  .build();

const TextfieldWithRipple = MKTextField.textfieldWithRipple()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .build();

const TextfieldWithRippleAndFloatingLabel = MKTextField.textfieldWithRippleAndFloatingLabel()
  .withPlaceholder('Text...')
  .withStyle(styles.textfieldWithFloatingLabel)
  .build();

const TextFields = React.createClass({
  render: function() {
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
  },
});

module.exports = TextFields;
