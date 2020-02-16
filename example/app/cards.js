import React from 'react';
import { Text, View, ScrollView, Image } from 'react-native';

import { IconToggle, getTheme } from 'react-native-material-kit';

import styles from './styles';

const theme = getTheme();

const base64Icon = 'http://www.getmdl.io/assets/demos/welcome_card.jpg';
const action = <Text> My action</Text>;
const menu = (
  <IconToggle checked={true} onCheckedChange={this._onIconChecked} onPress={this._onIconClicked}>
    <Text pointerEvents="none" style={styles.toggleTextOff}>
      Off
    </Text>
    <Text stateChecked pointerEvents="none" style={[styles.toggleText, styles.toggleTextOn]}>
      On
    </Text>
  </IconToggle>
);

const Cards = () => (
  <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
      {/* Here the magic happens*/}
      <View style={theme.cardStyle}>
        <Image source={{ uri: base64Icon }} style={theme.cardImageStyle} />
        <Text style={theme.cardTitleStyle}>Welcome</Text>
        <View // TextView padding not handled well on Android https://github.com/facebook/react-native/issues/3233
          style={{
            padding: 15,
          }}
        >
          <Text style={[theme.cardContentStyle, { padding: 0 }]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque
            lacus eleifend lacinia...
          </Text>
        </View>
        <View style={theme.cardMenuStyle}>{menu}</View>
        <View style={theme.cardActionStyle}>{action}</View>
      </View>
    </View>
  </ScrollView>
);

export default Cards;
