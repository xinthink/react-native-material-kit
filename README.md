# [Material Design](http://www.google.com/design/spec/material-design/introduction.html) components for [React Native](https://facebook.github.io/react-native)

[![react-native](https://img.shields.io/badge/react--native-v0.7.1-05A5D1.svg)](https://facebook.github.io/react-native "tested react-native version")
[![DUB](https://img.shields.io/dub/l/vibe-d.svg)](https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md "MIT")
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/xinthink/react-native-material-kit/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

This is a port of [MaterialKit](https://github.com/nghialv/MaterialKit) (written in Swift) to Objective-C, so that it can be used in [React Native](https://facebook.github.io/react-native) projects, as a static library.

Thanks to the great work of [@nghialv](https://github.com/nghialv)!

<script data-gratipay-username="xinthink"
        data-gratipay-widget="button"
        src="//grtp.co/v1.js"></script>

## Getting Started

`cd` to your React Native project,

1. `npm i -S react-native-material-kit`
2. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
3. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to build target's `Linked Frameworks and Libraries` list
4. `require('react-native-material-kit')` to start using the components, in js files
5. Have fun!


## Components

### Buttons

![buttons-mdl](https://cloud.githubusercontent.com/assets/390805/8761525/08593298-2d88-11e5-98dc-6180a5122b1f.gif)

Apply [Material Design Buttons](http://www.getmdl.io/components/index.html#buttons-section) with minimum codes, using pre-defined builders, which comply with [Material Design Lite default theme](http://www.getmdl.io/customize/index.html).

```jsx
// colored button with default theme (configurable)
var ColoredRaisedButton = MKButton.coloredButton()
  .withText('BUTTON')
  .withOnPress(() => {
    console.log("Hi, it's a colored button!");
  })
  .build();

...
<ColoredRaisedButton/>
```

Or you can definitely build customized buttons from scratch.

with builder:

```jsx
var CustomButton = new MKButton.Builder()
  .withBackgroundColor(MKColor.Teal)
  .withShadowRadius(2)
  .withShadowOffset({width:0, height:2})
  .withShadowOpacity(.7)
  .withShadowColor('black')
  .withOnPress(() => {
    console.log('hi, raised button!');
  })
  .withTextStyle({
    color: 'white',
    fontWeight: 'bold',
  })
  .withText('RAISED BUTTON')
  .build();

...
<CustomButton/>
```

equivalent jsx:

```jsx
<MKButton
  backgroundColor={MKColor.Teal}
  shadowRadius={2}
  shadowOffset={{width:0, height:2}}
  shadowOpacity={.7}
  shadowColor="black"
  onPress={() => {
    console.log('hi, raised button!');
  }}
  >
  <Text pointerEvents="none"
        style={{color: 'white', fontWeight: 'bold',}}>
    RAISED BUTTON
  </Text>
</MKButton>
```

Please refer to [the complete example](https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/textfields.js) for details.


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


It's the very begining of the project, more work to be done, contributions are welcome!
