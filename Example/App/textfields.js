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
  PixelRatio,
} = React;

const {
  MKTextField,
  MKColor,
  mdl,
} = MK;

const toPx = PixelRatio.getPixelSizeForLayoutSize.bind(PixelRatio);

const styles = Object.assign(appStyles, StyleSheet.create({
  textfield: {
    width: 100,
    height: 28,
    marginTop: 22,
  },
  textfieldWithFloatingLabel: {
    width: 100,
    height: toPx(20),
    marginTop: 10,
  },
}));

const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .build();

const TextfieldWithFloatingLabel = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('Number...')
  .withStyle(styles.textfieldWithFloatingLabel)
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
  })
  .withKeyboardType('numeric')
  .build();

const ColoredTextfield = mdl.Textfield.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .withTintColor(MKColor.Lime)
  .withTextInputStyle({color: MKColor.Orange})
  .build();

const PasswordInput = mdl.Textfield.textfieldWithFloatingLabel()
  .withPassword(true)
  .withPlaceholder('Password')
  .withValue('passcode')
  .withStyle(styles.textfieldWithFloatingLabel)
  .withOnFocus(() => console.log('Focus'))
  .withOnBlur(() => console.log('Blur'))
  .withOnEndEditing((e) => console.log('EndEditing', e.nativeEvent.text))
  .withOnSubmitEditing((e) => console.log('SubmitEditing', e.nativeEvent.text))
  .withOnTextChange((e) => console.log('TextChange', e))
  .withOnChangeText((e) => console.log('ChangeText', e))
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
            <TextfieldWithFloatingLabel/>
            <Text style={styles.legendLabel}>With floating label</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <ColoredTextfield/>
            <Text style={styles.legendLabel}>Textfield</Text>
          </View>
          <View style={styles.col}>
            <PasswordInput/>
            <Text style={styles.legendLabel}>With floating label</Text>
          </View>
        </View>
      </ScrollView>
    );
  },
});

module.exports = TextFields;
