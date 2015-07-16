# [Material Design](http://www.google.com/design/spec/material-design/introduction.html) components for [React Native](https://facebook.github.io/react-native)

[![DUB](https://img.shields.io/dub/l/vibe-d.svg)](https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md)

This is a port of [MaterialKit](https://github.com/nghialv/MaterialKit) (written in Swift) to Objective-C, so that it can be used in [React Native](https://facebook.github.io/react-native) projects, as a static library.

Thanks to the great work of [@nghialv](https://github.com/nghialv)!


## Getting Started

`CD` to your React Native project,

1. `npm i -S react-native-material-kit`
2. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
3. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to build target's `Linked Frameworks and Libraries` list
4. `require('react-native-material-kit')` to start using the components, in js files
5. Have fun!


## Components

It's the very begining of the project, few components are ready for now.

### Buttons

![buttons](https://cloud.githubusercontent.com/assets/390805/8454632/a65ec8ae-2031-11e5-93ba-f95874aa3fa3.gif)

[Example code](https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/buttons.js):

```jsx
<MKButton
  backgroundColor={"#3E50B4"}
  cornerRadius={3.0}
  shadowRadius={3.0}
  shadowOpacity={0.55}
  shadowColor="gray"
  shadowOffset={{width:0, height:2.5}}
  style={styles.button}
  onPress={() => {
    console.log('hi, raised button!');
  }}
  >
  <Text pointerEvents="none" style={{color: 'white'}}>
    RAISED BUTTON
  </Text>
</MKButton>
```


### Floating Buttons

![float-buttons](https://cloud.githubusercontent.com/assets/390805/8467915/4da90948-2097-11e5-9f4a-bc02da152774.gif)

[Example code](https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/buttons.js):

```jsx
<MKButton
  backgroundColor={"#009688"}
  cornerRadius={24}
  shadowRadius={3.5}
  shadowOpacity={0.75}
  shadowColor="black"
  shadowOffset={{width:1, height:5.5}}
  style={styles.floatButton}
  >
  <Text pointerEvents="none" style={styles.textPlus}>
    +
  </Text>
</MKButton>
```


### Text Fields

![textfields](https://cloud.githubusercontent.com/assets/390805/8715858/2f420854-2bbb-11e5-8ec9-9ff35b6fdeed.gif)

[Example code](https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/textfields.js):

```jsx
<MKTextField
  style={styles.textField}
  placeholder="Floating hint"
  tintColor="#2196F3"
  rippleLayerColor="#03A9F4"
  rippleLocation="right"
  floatingPlaceholderEnabled={true}
/>
```


There is more work to be done, contributions are welcome!
