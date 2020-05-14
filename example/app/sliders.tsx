/**
 * Created by ywu on 15/8/31.
 */

import React, { Component, createRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Slider, RangeSlider, NumRange } from 'react-native-material-kit';

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
  }),
);

interface ValueTextProps {
  initial: string;
  rangeText?: string;
}

interface ValueTextStyle {
  curValue: string;
}

class ValueText extends Component<ValueTextProps, ValueTextStyle> {
  constructor(props: ValueTextProps) {
    super(props);
    this.state = {
      curValue: props.initial,
    };
  }

  onChange(curValue: string) {
    this.setState({ curValue });
  }

  render = () => (
    <Text style={styles.legendLabel}>
      {this.state.curValue} {this.props.rangeText ? `(${this.props.rangeText})` : ''}
    </Text>
  );
}

class Sliders extends Component {
  sliderWithValue = createRef<Slider>();
  rangeSlider = createRef<RangeSlider>();
  valueText = createRef<ValueText>();
  rangeValueText = createRef<ValueText>();

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
          styles.container,
          {
            paddingTop: 120,
          },
        ]}>
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

  _onChange = (value: number) => {
    const text = this.valueText.current;
    if (text) {
      text.onChange(value.toFixed(2));
    }
  };

  _onRangeChange = (range: NumRange) => {
    const text = this.rangeValueText.current;
    if (text) {
      text.onChange(range.min.toFixed(2) + '-' + range.max.toFixed(2));
    }
  };
}

export default Sliders;
