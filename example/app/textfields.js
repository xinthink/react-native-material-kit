/**
 * Created by ywu on 15/7/16.
 */
import React, { createRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';

import { Textfield, MKColor } from 'react-native-material-kit';

import appStyles from './styles';

const styles = Object.assign(
  {},
  appStyles,
  StyleSheet.create({
    col: {
      flex: 1,
      flexDirection: 'column',
      // alignItems: 'center', // this will prevent TFs from stretching horizontal
      marginLeft: 7,
      marginRight: 7,
      // backgroundColor: MKColor.Lime,
    },
    textfield: {
      height: 28, // have to do it on iOS
      marginTop: 32,
    },
    textfieldWithFloatingLabel: {
      height: 48, // have to do it on iOS
      marginTop: 10,
    },
  })
);

export default class extends React.Component {
  defaultInputRef = createRef();

  componentDidMount() {
    setTimeout(() => {
      this.defaultInputRef.current && this.defaultInputRef.current.focus();
    }, 500);
  }

  render = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Textfield
            floatingLabelEnabled={false}
            placeholder="Text..."
            style={styles.textfield}
            textInputStyle={{
              flex: 1,
            }}
          />
          <Text style={styles.legendLabel}>Textfield</Text>
        </View>
        <View style={styles.col}>
          <Textfield
            ref={this.defaultInputRef}
            placeholder="Number..."
            style={styles.textfieldWithFloatingLabel}
            textInputStyle={{ flex: 1 }}
            floatingLabelFont={{
              fontSize: 12,
              fontStyle: 'italic',
              fontWeight: '200',
            }}
            keyboardType={'numeric'}
          />
          <Text style={styles.legendLabel}>With floating label</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Textfield
            floatingLabelEnabled={false}
            placeholder="Text..."
            style={styles.textfield}
            textInputStyle={{
              flex: 1,
              color: MKColor.Orange,
            }}
            tint={MKColor.Lime}
          />
          <Text style={styles.legendLabel}>Textfield</Text>
        </View>
        <View style={styles.col}>
          <Textfield
            password
            placeholder="Password"
            defaultValue="!123"
            style={styles.textfieldWithFloatingLabel}
            textInputStyle={{ flex: 1 }}
            highlightColor={MKColor.DeepPurple}
            onFocus={e => console.log('Focus', !!e)}
            onBlur={e => console.log('Blur', !!e)}
            onEndEditing={e => console.log('EndEditing', !!e)}
            onSubmitEditing={e => console.log('SubmitEditing', !!e)}
            onTextChange={s => console.log('TextChange', s)}
            onChangeText={s => console.log('ChangeText', s)}
          />
          <Text style={styles.legendLabel}>With floating label</Text>
        </View>
      </View>
      {/* <TF /> */}
    </ScrollView>
  );
}

class TF extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 10,
    };
  }

  render = () => (
    <View style={styles.row}>
      <View style={styles.col}>
        <TextInput
          defaultValue={this.state.count < 1 ? undefined : `${this.state.count}`}
          underlineColorAndroid={MKColor.Amber}
          onChangeText={s => console.log(`text => ${s}`)}
        />
      </View>
      <Button title="Change" onPress={() => this.setState({ count: 0 })} />
    </View>
  );
}
