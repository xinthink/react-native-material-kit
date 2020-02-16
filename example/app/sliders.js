/**
 * Created by ywu on 15/8/31.
 */

import React, { Component, createRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MKColor, Slider, RangeSlider, setTheme } from 'react-native-material-kit';

import appStyles from './styles';

// customize the material design theme
// setTheme({
//   primaryColor: MKColor.Orange,
// });

const styles = Object.assign(
  {},
  appStyles,
  StyleSheet.create({
    slider: {
      width: 130,
    },
  })
);

class ValueText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curValue: props.initial,
    };
  }

  onChange(curValue) {
    this.setState({ curValue });
  }

  render() {
    return (
      <Text style={styles.legendLabel}>
        {this.state.curValue} ({this.props.rangeText})
      </Text>
    );
  }
}

class Sliders extends Component {
  sliderWithValue = createRef();
  rangeSlider = createRef();
  valueText = createRef();
  rangeValueText = createRef();

  componentDidMount() {
    const slider = this.sliderWithValue.current;
    // const ranged = this.rangeSlider.current;

    setTimeout(() => {
      if (slider) {
        slider.value = 75;
      }
      // if (ranged) {
      //   ranged.maxValue = 95;
      // }
    }, 1000);
  }

  render() {
    return (
      <View
        style={[
          styles.scrollView,
          {
            marginTop: 120,
          },
        ]}
        contentContainerStyle={styles.container}
      >
        <View style={styles.row}>
          <View style={styles.col}>
            <Slider style={styles.slider} />
            <Text style={styles.legendLabel}>Slider</Text>
          </View>
          <View style={styles.col}>
            <Slider
              ref={this.sliderWithValue}
              min={10}
              max={100}
              value={25}
              style={styles.slider}
              onChange={this._onChange}
            />
            <ValueText ref={this.valueText} initial="25.00" rangeText="10~100" />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col}>
            <RangeSlider style={styles.slider} />
            <Text style={styles.legendLabel}>Range Slider</Text>
          </View>
          <View style={styles.col}>
            <RangeSlider
              ref={this.rangeSlider}
              range={{ min: 20, max: 75 }}
              step={5}
              style={styles.slider}
              onChange={this._onRangeChange}
            />
            <ValueText ref={this.rangeValueText} initial="20.00-75.00" rangeText="10~100" />
          </View>
        </View>
      </View>
    );
  }

  _onChange = value => {
    const text = this.valueText.current;
    if (text) {
      text.onChange(value.toFixed(2));
    }
  };

  _onRangeChange = range => {
    const text = this.rangeValueText.current;
    if (text) {
      text.onChange(range.min.toFixed(2) + '-' + range.max.toFixed(2));
    }
  };
}

export default Sliders;
