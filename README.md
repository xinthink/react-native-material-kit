# [Material Design](http://www.google.com/design/spec/material-design/introduction.html) components for [React Native](https://facebook.github.io/react-native)

[![npm](https://img.shields.io/npm/v/react-native-material-kit.svg)](https://www.npmjs.com/package/react-native-material-kit)
[![react-native](https://img.shields.io/badge/react--native-v0.7.1-05A5D1.svg)](https://facebook.github.io/react-native "tested react-native version")
[![DUB](https://img.shields.io/dub/l/vibe-d.svg)](https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md "MIT")

This is a port of [MaterialKit](https://github.com/nghialv/MaterialKit) (written in Swift) to Objective-C, so that it can be used in [React Native](https://facebook.github.io/react-native) projects, as a static library.

Thanks to the great work of [@nghialv](https://github.com/nghialv)! :thumbsup:


## Getting Started

`cd` to your React Native project,

1. `npm i -S react-native-material-kit`
2. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
3. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to build target's `Linked Frameworks and Libraries` list
4. `require('react-native-material-kit')` to start using the components, in js files
5. Have fun!


## Components

### Buttons

![buttons-mdl](https://cloud.githubusercontent.com/assets/390805/8888853/69f8d9f8-32f2-11e5-9823-c235ab8c0dd2.gif)

Apply [Material Design Buttons](http://www.getmdl.io/components/index.html#buttons-section) with minimum codes using pre-defined builders, which comply with the [Material Design Lite default theme](http://www.getmdl.io/customize/index.html).

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

And you can definitely build customized buttons from scratch.

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

the jsx equivalent:

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

:point_right: [the complete example](https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/buttons.js)

> Why builders? See the '[Builder vs. configuration object](https://github.com/xinthink/react-native-material-kit/issues/3)' discussion


### Text Fields

Built-in textfields, which comply with [Material Design Lite](http://www.getmdl.io/components/#textfields-section).

![textfields-mdl](https://cloud.githubusercontent.com/assets/390805/8794770/26b24724-2fb9-11e5-9af4-abead1cd456b.gif)


```jsx
// textfield with default theme (configurable)
var Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .build();

...
<Textfield/>
```

Customizing textfields through builder:

```jsx
var CustomTexfield = new MKTextField.Builder()
  .withBackgroundColor('rgba(158,158,158,.2)')
  .withTintColor(MKColor.Teal)
  .withTextColor(MKColor.Orange)
  .withPlaceholder('Hint')
  .withRippleEnabled(true)
  .withStyle(styles.textfield)
  .build();

...
<CustomTexfield/>
```

the jsx equivalent:

```jsx
<MKTextField
  backgroundColor="rgba(158,158,158,.2)"
  tintColor={MKColor.Teal}
  textColor={MKColor.Orange}
  placeholder="Hint"
  rippleEnabled={true}
  style={styles.textfield}/>
```

:point_right: [the complete example](https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/textfields.js)


---
It's the very begining of the project, lots of work to be done, contributions are welcome! :beer:
