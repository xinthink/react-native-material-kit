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
  PixelRatio,
} = React;

const {
  MKColor,
  mdl,
} = MK;

const toPx = PixelRatio.getPixelSizeForLayoutSize.bind(PixelRatio);

const styles = Object.assign(appStyles, StyleSheet.create({
  progress: {
    width: toPx(75),
    height: toPx(2),
  },
}));


const Progress = React.createClass({
  componentDidMount: function () {
    setTimeout((() => {
      this.refs.progBar.progress = 0.75;
    }), 1000);
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
              progress={0.3}
              />
            <Text style={styles.legendLabel}>Default Progress Bar</Text>
          </View>
        </View>
      </ScrollView>
    );
  },
});

module.exports = Progress;
