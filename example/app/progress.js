/**
 * Created by ywu on 15/8/13.
 */

import React, { createRef } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { Progress, Spinner } from 'react-native-material-kit';
import appStyles from './styles';

const styles = Object.assign(
  {},
  appStyles,
  StyleSheet.create({
    progress: {
      width: 150,
      //height: 2,
    },
    spinner: {
      // width: 22,
      // height: 22,
    },
  })
);

export default class extends React.Component {
  _progRef = createRef();
  _progWithBufferRef = createRef();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => {
      const progBarWithBuffer = this._progWithBufferRef.current;
      if (progBarWithBuffer) {
        progBarWithBuffer.buffer = 0.8;
      }
    }, 1000);
    setTimeout(() => {
      const progBar = this._progRef.current;
      const progBarWithBuffer = this._progWithBufferRef.current;
      if (progBar && progBarWithBuffer) {
        progBar.progress = 0.6;
        progBarWithBuffer.progress = 0.6;
      }
    }, 1600);
  }

  render = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Progress ref={this._progRef} style={styles.progress} progress={0.2} />
          <Text style={styles.legendLabel}>Default progress bar</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Progress.Indeterminate style={styles.progress} />
          <Text style={styles.legendLabel}>Indeterminate</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Progress ref={this._progWithBufferRef} style={styles.progress} progress={0.2} buffer={0.3} />
          <Text style={styles.legendLabel}>Buffering</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Spinner style={styles.spinner} />
          <Text style={styles.legendLabel}>Default spinner</Text>
        </View>
        <View style={styles.col}>
          <Spinner style={styles.spinner} strokeColor="purple" />
          <Text style={styles.legendLabel}>Single color</Text>
        </View>
      </View>
    </ScrollView>
  );
}
