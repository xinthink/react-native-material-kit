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
    width: 80,
    marginTop: 18,
    height: 28,
  },
  textfieldWithFloatingLabel: {
    width: 80,
    marginTop: 18,
    height: 38,
    fontSize: 14,
  },
  mdlTextfieldWithFloatingLabel: {
    width: 80,
    height: toPx(20),
    marginTop: 18,
    // fontSize: 14,
    // padding: 2,
  },
}));

const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withTintColor(MKColor.Lime)
  .withStyle(styles.textfield)
  .withOnFocus((e) => console.log('Focus', e))
  .withOnBlur((e) => console.log('Blur', e))
  .withOnEndEditing((e) => console.log('EndEditing', e))
  .withOnSubmitEditing((e) => console.log('SubmitEditing', e))
  .withOnTextChange((e) => console.log('TextChange', e))
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
        <View style={styles.row}>
          <View style={styles.col}>
            <mdl.Textfield
              placeholder="Text..."
              value="Hello"
              style={[styles.textfield, {marginTop: 30}]}
              textInputStyle={{
                // color: '#666666',
              }}
            />
            <Text style={styles.legendLabel}>Standard textfield</Text>
          </View>
          <View style={styles.col}>
            <mdl.Textfield
              floatingLabelEnabled={true}
              placeholder="Text..."
              value="Hello"
              style={styles.mdlTextfieldWithFloatingLabel}
              editable={true}
              onFocus={() => console.log('Focus')}
              onBlur={() => console.log('Blur')}
              onEndEditing={(e) => console.log('EndEditing', e.nativeEvent.text)}
              onSubmitEditing={(e) => console.log('SubmitEditing', e.nativeEvent.text)}
              onTextChange={(e) => console.log('TextChange', e)}
              onChangeText={(e) => console.log('ChangeText', e)}
            />
            <Text style={styles.legendLabel}>With floating label</Text>
          </View>
        </View>
      </ScrollView>
    );
  },
});

module.exports = TextFields;
