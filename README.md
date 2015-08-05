[![npm][npm-badge]][npm]
[![react-native][rn-badge]][rn]
[![MIT][license-badge]][license]

A set of UI components, in the purpose of introducing [Material Design][md] to apps built with [React Native][rn], quickly and painlessly.

[npm-badge]: https://img.shields.io/npm/v/react-native-material-kit.svg
[npm]: https://www.npmjs.com/package/react-native-material-kit
[rn-badge]: https://img.shields.io/badge/react--native-v0.9.0-05A5D1.svg
[rn]: https://facebook.github.io/react-native
[md]: http://www.google.com/design/spec/material-design/introduction.html
[license-badge]: https://img.shields.io/dub/l/vibe-d.svg
[license]: https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md

## Getting Started

`cd` to your RN project directory,

1. `npm i -S react-native-material-kit`
2. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
3. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to build target's `Linked Frameworks and Libraries` list
4. `require('react-native-material-kit')` to start using the components, in js files
5. Have fun!

> Looking for api docs? Please refer to the [Annotated Source][docs].

[docs]: http://xinthink.github.io/react-native-material-kit/docs/index.html

## Components

### Buttons

![buttons-mdl][img-buttons]

Apply [Material Design Buttons][mdl-buttons] with a few lines of code using predefined builders, which comply with the [Material Design Lite default theme][mdl-theme].

```jsx
// colored button with default theme (configurable)
const ColoredRaisedButton = MKButton.coloredButton()
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
const CustomButton = new MKButton.Builder()
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

👉 [the complete example][buttons-sample]

> Why builders? See the ‘[Builder vs. configuration object][issue-3]’ discussion.

[img-buttons]: https://cloud.githubusercontent.com/assets/390805/8888853/69f8d9f8-32f2-11e5-9823-c235ab8c0dd2.gif
[mdl-buttons]: http://www.getmdl.io/components/index.html#buttons-section
[mdl-theme]: http://www.getmdl.io/customize/index.html
[buttons-sample]: https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/buttons.js
[issue-3]: https://github.com/xinthink/react-native-material-kit/issues/3

### Text Fields

Built-in textfields, which comply with [Material Design Lite][mdl-tf].

![textfields-mdl][img-tf]

```jsx
// textfield with default theme (configurable)
const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .build();

...
<Textfield/>
```

Customizing textfields through builder:

```jsx
const ColoredTextfield = mdl.Textfield.textfield()
  .withPlaceholder(‘Text…’)
  .withStyle(styles.textfield)
  .withTintColor(MKColor.Lime)
  .withTextInputStyle({color: MKColor.Orange})
  .build();
...
<CustomTexfield/>
```

the jsx equivalent:

```jsx
<MKTextField
  tintColor={MKColor.Lime}
  textInputStyle={{color: MKColor.Orange}}
  placeholder=“Text…”
  style={styles.textfield}/>
```

👉 [the complete example][tf-sample]


[mdl-tf]: http://www.getmdl.io/components/#textfields-section
[img-tf]: https://cloud.githubusercontent.com/assets/390805/9085678/8280484a-3bb1-11e5-9354-a244b0520736.gif
[tf-sample]: https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/textfields.js

### Toggles

[Icon toggle][mdl-icon-toggle] & [Switch][mdl-switch]
![toggles-mdl][img-toggles]

[mdl-icon-toggle]: http://www.getmdl.io/components/index.html#toggles-section/icon-toggle
[mdl-switch]: http://www.getmdl.io/components/index.html#toggles-section/switch
[img-toggles]: https://cloud.githubusercontent.com/assets/390805/8903074/de0ed748-3487-11e5-9448-9ee304e0a6b6.gif

### Icon toggle

```jsx
<MKIconToggle
  checked={true}
  onCheckedChange={this._onIconChecked}
  onPress={this._onIconClicked}
  >
  <Text pointerEvents="none"
        style={styles.toggleTextOff}>Off</Text>
  <Text state_checked={true}
        pointerEvents="none"
        style={[styles.toggleText, styles.toggleTextOn]}>On</Text>
</MKIconToggle>
```

The two `Text` tags here, similar to [State List][android-state-list] in *Android* development, which can give you the flexibility to decide what content and how it is shown for each state of the toggle. For example, you can use [react-native-icons][rn-icons] here, or any other sophisticated contents.

[android-state-list]: http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList
[rn-icons]: http://www.xinthink.com/react-native-material-kit/docs/Lib/mdl/Switch.html

### Switch

```jsx
// using Builder
const OrangeAppleSwitch = MKSwitch.mkSwitch()
  .withStyle(styles.appleSwitch)
  .withOnColor('rgba(255,152,0,.3)')
  .withThumbOnColor(MKColor.Orange)
  .withRippleLayerColor('rgba(255,152,0,.2)')
  .withOnCheckedChange(() => console.log('orange switch clicked'))
  .build();
...
<OrangeAppleSwitch/>

// jsx only
<MKSwitch
  style={styles.appleSwitch}
  onColor="rgba(255,152,0,.3)"
  thumbOnColor={MKColor.Orange}
  rippleLayerColor="rgba(255,152,0,.2)"
  onCheckedChange={() => console.log('orange switch clicked')}
/>
```

Actually, there's also a **pure-jsx-implemented** `Switch` available, in which you may be interested, please refer to the [Annotated Source][docs-switch] for details.

👉 [the complete example][toggles-sample]

[toggles-sample]: https://github.com/xinthink/react-native-material-kit/blob/master/Example/App/toggles.js
[docs-switch]: http://www.xinthink.com/react-native-material-kit/docs/Lib/mdl/Switch.html

## About
This project began with porting [MaterialKit][mdk], thanks [@nghialv][at-ng] for the great work!👍🖖
But before long, I decided to rewrite in JSX (in progress), with no or limited help of native code.
Life would be easier for me, if I don’t have to do the porting again😵 for the forthcoming *RN Android*, although I have no idea how to provide it on *Android* for now, which is [MD][md]’s home field😅.

And lastly, it’s the very beginning of the project, lots of work to be done, ***contributions*** are welcome!🍻

[at-ng]: https://github.com/nghialv
[mdk]: https://github.com/nghialv/MaterialKit
