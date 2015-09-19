[![npm][npm-badge]][npm]
[![react-native][rn-badge]][rn]
[![MIT][license-badge]][license]
[![bitHound Score][bithound-badge]][bithound]

A set of UI components, in the purpose of introducing [Material Design][md] to apps built with [React Native][rn], quickly and painlessly.

[npm-badge]: https://img.shields.io/npm/v/react-native-material-kit.svg
[npm]: https://www.npmjs.com/package/react-native-material-kit
[rn-badge]: https://img.shields.io/badge/react--native-v0.11.x-05A5D1.svg
[rn]: https://facebook.github.io/react-native
[md]: http://www.google.com/design/spec/material-design/introduction.html
[license-badge]: https://img.shields.io/dub/l/vibe-d.svg
[license]: https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md
[bithound-badge]: https://www.bithound.io/github/xinthink/react-native-material-kit/badges/score.svg
[bithound]: https://www.bithound.io/github/xinthink/react-native-material-kit

## Getting Started

`cd` to your RN project directory,

1. `npm i -S react-native-material-kit`
2. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
3. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to build target's `Linked Frameworks and Libraries` list
4. `require('react-native-material-kit')` to start using the components, in js files
5. Have fun!

> - Looking for api docs? Try the [Annotated Source][docs].
> - Debugging local module? Please refer to [Debugging local RNMK module][debug-with-demo]

[docs]: http://xinthink.github.io/react-native-material-kit/docs/index.html
[debug-with-demo]: https://github.com/xinthink/rnmk-demo#debugging-local-rnmk-module

## Components
- [Buttons](#buttons)
- [Textfields](#text-fields)
- [Toggles](#toggles)
  - [Icon toggle](#icon-toggle)
  - [Switch](#switch)
- [Loading](#loading)
  - [Progress bar](#progress-bar)
  - [Spinner](#spinner)
- [Sliders](#sliders)

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

👉 [props reference][button-props-doc] and [example code][buttons-sample]

> Why builders? See the ‘[Builder vs. configuration object][issue-3]’ discussion.

[img-buttons]: https://cloud.githubusercontent.com/assets/390805/8888853/69f8d9f8-32f2-11e5-9823-c235ab8c0dd2.gif
[mdl-buttons]: http://www.getmdl.io/components/index.html#buttons-section
[mdl-theme]: http://www.getmdl.io/customize/index.html
[buttons-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/buttons.js
[issue-3]: https://github.com/xinthink/react-native-material-kit/issues/3
[button-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/MKButton.html#props

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

👉 [props reference][tf-props-doc] and [example code][tf-sample]

[mdl-tf]: http://www.getmdl.io/components/#textfields-section
[img-tf]: https://cloud.githubusercontent.com/assets/390805/9085678/8280484a-3bb1-11e5-9354-a244b0520736.gif
[tf-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/textfields.js
[tf-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Textfield.html#props

### Toggles

[Icon toggle][mdl-icon-toggle] & [Switch][mdl-switch]
![toggles-mdl][img-toggles]

[mdl-icon-toggle]: http://www.getmdl.io/components/index.html#toggles-section/icon-toggle
[mdl-switch]: http://www.getmdl.io/components/index.html#toggles-section/switch
[img-toggles]: https://cloud.githubusercontent.com/assets/390805/8903074/de0ed748-3487-11e5-9448-9ee304e0a6b6.gif

#### Icon toggle

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

👉 [props reference][icon-toggle-props-doc] and [example code][toggles-sample]

[android-state-list]: http://developer.android.com/guide/topics/resources/drawable-resource.html#StateList
[rn-icons]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Switch.html
[icon-toggle-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/MKIconToggle.html#props

#### Switch

```jsx
<mdl.Switch style={styles.appleSwitch}
          onColor="rgba(255,152,0,.3)"
          thumbOnColor={MKColor.Orange}
          rippleColor="rgba(255,152,0,.2)"
          onPress={() => console.log('orange switch pressed')}
          onCheckedChange={(e) => console.log('orange switch checked', e)}
/>
```

👉 [props reference][switch-js-props-doc] and [example code][toggles-sample]

[toggles-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/toggles.js
[switch-js-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Switch.html#props

### Loading
[MDL Loading][mdl-loading] components.

#### Progress bar
![progress-demo][]

```jsx
<mdl.Progress
  style={styles.progress}
  progress={0.2}
  />
```

👉 [props reference][prog-props-doc] and [example code][progress-sample]

#### Spinner
![spinner-demo][]

```jsx
<mdl.Spinner/>
```

👉 [props reference][spinner-props-doc] and [example code][progress-sample]

[mdl-loading]: http://www.getmdl.io/components/index.html#loading-section
[progress-demo]: https://cloud.githubusercontent.com/assets/390805/9288698/01e31432-4387-11e5-98e5-85b18471baeb.gif
[spinner-demo]: https://cloud.githubusercontent.com/assets/390805/9291361/6e7a75bc-43ec-11e5-95be-2b33eb7f8734.gif
[progress-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/progress.js
[prog-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Progress.html#props
[spinner-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Spinner.html#props

### Sliders
[MDL Slider][mdl-slider] components.
![slider-demo][]

```jsx
<mdl.Slider style={styles.slider}/>
…
const SliderWithValue = mdl.Slider.slider()
  .withStyle(styles.slider)
  .withMin(10)
  .withMax(100)
  .build();
…
<SliderWithValue
	ref=“sliderWithValue”
  onChange={(curValue) => this.setState({curValue})}
  />
```

👉 [props reference][slider-props-doc] and [example code][slider-sample]

[mdl-slider]: http://www.getmdl.io/components/index.html#sliders-section
[slider-demo]: https://cloud.githubusercontent.com/assets/390805/9685661/44260e64-5352-11e5-9fea-0a8aecc07de2.gif
[slider-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/sliders.js
[slider-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Slider.html#props

## About
This project began with porting [MaterialKit][], thanks [@nghialv][] for the great work!👍🖖

But before long, I decided to rewrite all the components in JSX, with no or limited help of native code, and the rewriting is in progress.

And lastly, it’s the very beginning of the project, lots of work to be done, ***contributions*** are welcome!🎉🍻

[@nghialv]: https://github.com/nghialv
[MaterialKit]: https://github.com/nghialv/MaterialKit
