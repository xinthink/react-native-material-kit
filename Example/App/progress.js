/**
 * Created by ywu on 15/8/13.
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
  mdl,
} = MK;

const styles = Object.assign(appStyles, StyleSheet.create({
  progress: {
    width: 125,
    //height: 2,
  },
  spinner: {
    //width: 22,
    //height: 22,
  },
}));

const Indeterminate = mdl.Progress.indeterminateProgress()
  .withStyle(styles.progress)
  .build();

const SingleColorSpinner = mdl.Spinner.singleColorSpinner()
  .withStyle(styles.spinner)
  .build();

const Progress = React.createClass({
  componentDidMount: function () {
    setTimeout((() => {
      this.refs.progBarWithBuffer.buffer = 0.8;
    }), 1000);
    setTimeout((() => {
      this.refs.progBar.progress = 0.6;
      this.refs.progBarWithBuffer.progress = 0.6;
    }), 1600);
  },

  render: function() {
    return (
      <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.col}>
            <mdl.Progress
              ref="progBar"
              style={styles.progress}
              progress={0.2}
              />
            <Text style={styles.legendLabel}>Default progress bar</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <Indeterminate/>
            <Text style={styles.legendLabel}>Indeterminate</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <mdl.Progress
              ref="progBarWithBuffer"
              style={styles.progress}
              progress={0.2}
              buffer={0.3}
              />
            <Text style={styles.legendLabel}>Buffering</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <mdl.Spinner style={styles.spinner}/>
            <Text style={styles.legendLabel}>Default spinner</Text>
          </View>
          <View style={styles.col}>
            <SingleColorSpinner/>
            <Text style={styles.legendLabel}>Single color</Text>
          </View>
        </View>
      </ScrollView>
    );
  },
});

module.exports = Progress;
