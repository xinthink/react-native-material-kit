import React from 'react';
import { Text, View, ScrollView, Image } from 'react-native';

import { IconToggle, getTheme, CheckedListener } from 'react-native-material-kit';

import styles from './styles';

const theme = getTheme();

const base64Icon = 'http://www.getmdl.io/assets/demos/welcome_card.jpg';

const onIconChecked: CheckedListener = ({ checked }) => console.log(`the IconToggle is ${checked ? 'ON' : 'OFF'}`);
const onIconClicked = () => console.log('-- clicked --');

const action = <Text> My action</Text>;
const menu = (
  <IconToggle checked={true} onCheckedChange={onIconChecked} onPress={onIconClicked}>
    <Text style={styles.toggleTextOff}>Off</Text>
    <Text
      // @ts-ignore
      stateChecked
      style={styles.toggleTextOn}>
      On
    </Text>
  </IconToggle>
);

const Cards = () => (
  <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
    {/* Here the magic happens*/}
    <View style={theme.cardStyle as any}>
      <Image source={{ uri: base64Icon }} style={theme.cardImageStyle as any} />
      <Text style={theme.cardTitleStyle as any}>Welcome</Text>
      <View // TextView padding not handled well on Android https://github.com/facebook/react-native/issues/3233
        style={{
          padding: 15,
        }}>
        <Text style={[theme.cardContentStyle as any, { padding: 0 }]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend
          lacinia...
        </Text>
      </View>
      <View style={theme.cardMenuStyle as any}>{menu}</View>
      <View style={theme.cardActionStyle as any}>{action}</View>
    </View>
  </ScrollView>
);

export default Cards;
