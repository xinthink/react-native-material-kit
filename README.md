[![npm][npm-badge]][npm]
[![react-native][rn-badge]][rn]
[![MIT][license-badge]][license]
[![bitHound Score][bithound-badge]][bithound]
[![Gitter][gitter-badge]][gitter-rnmk]


A set of UI components, in the purpose of introducing [Material Design][md] to apps built with [React Native][rn], quickly and painlessly.

[npm-badge]: https://img.shields.io/npm/v/react-native-material-kit.svg
[npm]: https://www.npmjs.com/package/react-native-material-kit
[rn-badge]: https://img.shields.io/badge/react--native-v0.35-05A5D1.svg
[rn]: https://facebook.github.io/react-native
[md]: http://www.google.com/design/spec/material-design/introduction.html
[license-badge]: https://img.shields.io/dub/l/vibe-d.svg
[license]: https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md
[bithound-badge]: https://www.bithound.io/github/xinthink/react-native-material-kit/badges/score.svg
[bithound]: https://www.bithound.io/github/xinthink/react-native-material-kit
[gitter-badge]: https://img.shields.io/gitter/room/xinthink/react-native-material-kit.svg
[gitter-rnmk]: https://gitter.im/xinthink/react-native-material-kit

## Getting Started

First, `cd` to your RN project directory, and install RNMK through [rnpm](https://github.com/rnpm/rnpm) . If you don't have rnpm, you can install RNMK from npm with the command `npm i -S react-native-material-kit` and link it manually (see below).

### iOS

* ####React Native < 0.29 (Using rnpm)

  `rnpm install react-native-material-kit`

* ####React Native >= 0.29
  `$npm install -S react-native-material-kit`

  `$react-native link react-native-material-kit`



#### Manually
1. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
1. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to build target's `Linked Frameworks and Libraries` list

#### Option: Using [CocoaPods](https://cocoapods.org)

Assuming you have [CocoaPods](https://cocoapods.org) installed, create a `PodFile` like this in your app's project directory. You can leave out the modules you don't need.

```ruby
xcodeproj 'path/to/YourProject.xcodeproj/'

pod 'React', :subspecs => ['Core', 'RCTText', 'RCTWebSocket'], :path => 'node_modules/react-native'
pod 'react-native-material-kit', :path => 'node_modules/react-native-material-kit'

post_install do |installer|
  target = installer.pods_project.targets.select{|t| 'React' == t.name}.first
  phase = target.new_shell_script_build_phase('Run Script')
  phase.shell_script = "if nc -w 5 -z localhost 8081 ; then\n  if ! curl -s \"http://localhost:8081/status\" | grep -q \"packager-status:running\" ; then\n    echo \"Port 8081 already in use, packager is either not running or not running correctly\"\n    exit 2\n  fi\nelse\n  open $SRCROOT/../node_modules/react-native/packager/launchPackager.command || echo \"Can't start packager automatically\"\nfi"
end
```

Now run `pod install`. This will create an Xcode workspace containing all necessary native files, including react-native-material-kit. From now on open `YourProject.xcworkspace` instead of `YourProject.xcodeproject` in Xcode. Because React Native's iOS code is now pulled in via CocoaPods, you also need to remove the `React`, `RCTImage`, etc. subprojects from your app's Xcode project, in case they were added previously.

### Android

* ####React Native < 0.29 (Using rnpm)

  `rnpm install react-native-material-kit`

* ####React Native >= 0.29
  `$npm install -S react-native-material-kit`

  `$react-native link react-native-material-kit`

#### Manually
1. JDK 7+ is required
1. Add the following snippet to your `android/settings.gradle`:
  ```gradle
  include ':RNMaterialKit'
  project(':RNMaterialKit').projectDir = file('../node_modules/react-native-material-kit/android')

  ```
1. Declare the dependency in your `android/app/build.gradle`
  ```gradle
  dependencies {
      ...
      compile project(':RNMaterialKit')
  }

  ```
1. Import `com.github.xinthink.rnmk.ReactMaterialKitPackage` and register it in your `MainActivity` (or equivalent, RN >= 0.32 MainApplication.java):

  ```java
  @Override
  protected List<ReactPackage> getPackages() {
      return Arrays.asList(
              new MainReactPackage(),
              new ReactMaterialKitPackage()
      );
  }
  ```

Finally, you're good to go, feel free to require `react-native-material-kit` in your JS files.

Have fun! :metal:

## Resources
- [Release Notes]
- Refer to the [Annotated Source][docs] as API docs
- Source code of [Demo app][]
- For contributors, please refer to [How to debug local RNMK module][debug-with-demo]
- Chat about bugs/features on [Gitter][gitter-rnmk]

[docs]: http://xinthink.github.io/react-native-material-kit/docs/index.html
[Demo app]: https://github.com/xinthink/rnmk-demo
[debug-with-demo]: https://github.com/xinthink/rnmk-demo#debugging-local-rnmk-module
[Release Notes]: https://github.com/xinthink/react-native-material-kit/releases

## Components
- [Buttons](#buttons)
- [Cards](#cards)
- [Loading](#loading)
  - [Progress bar](#progress-bar)
  - [Spinner](#spinner)
- [Sliders](#sliders)
  - [Range Slider](#range-slider)
- [Textfields](#text-fields)
- [Toggles](#toggles)
  - [Checkbox](#checkbox)
  - [Radio button](#radio-button)
  - [Icon toggle](#icon-toggle)
  - [Switch](#switch)

### Buttons

[![img-buttons]][mdl-buttons]

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
<ColoredRaisedButton />
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
<CustomButton />
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
[button-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Button.html#props

### Cards
[![img-cards]][cards-mdl]

Apply [`Card Style`][cards-mdl] with only few styles !.
```jsx
import {
  getTheme,
  ...
} from 'react-native-material-kit';

const theme = getTheme();

<View style={theme.cardStyle}>
  <Image source={{uri : base64Icon}} style={theme.cardImageStyle} />
  <Text style={theme.cardTitleStyle}>Welcome</Text>
  <Text style={theme.cardContentStyle}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Mauris sagittis pellentesque lacus eleifend lacinia...
  </Text>
  <View style={theme.cardMenuStyle}>{menu}</View>
  <Text style={theme.cardActionStyle}>My Action</Text>
</View>

```

👉 [example code][card-sample]

[cards-mdl]: http://www.getmdl.io/components/index.html#cards-section
[img-cards]: https://cloud.githubusercontent.com/assets/390805/10262736/4411994a-6a07-11e5-8a72-b7a46ba5e4a9.png
[card-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/cards.js

### Loading
[MDL Loading][mdl-loading] components.

#### Progress bar
[![progress-demo]][mdl-loading]

```jsx
<mdl.Progress
  style={styles.progress}
  progress={0.2}
/>
```

👉 [props reference][prog-props-doc] and [example code][progress-sample]

#### Spinner
[![spinner-demo]][mdl-loading]

```jsx
<mdl.Spinner />
```

👉 [props reference][spinner-props-doc] and [example code][progress-sample]

[mdl-loading]: http://www.getmdl.io/components/index.html#loading-section
[progress-demo]: https://cloud.githubusercontent.com/assets/390805/9288698/01e31432-4387-11e5-98e5-85b18471baeb.gif
[spinner-demo]: https://cloud.githubusercontent.com/assets/390805/9291361/6e7a75bc-43ec-11e5-95be-2b33eb7f8734.gif
[progress-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/progress.js
[prog-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Progress.html#props
[spinner-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Spinner.ios.html#props

### Sliders
[MDL Slider][mdl-slider] components.
[![slider-demo]][mdl-slider]

```jsx
<mdl.Slider style={styles.slider} />
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

### Range Slider
![range-slider-demo]

```jsx
<mdl.RangeSlider style={styles.slider} />
…
const SliderWithRange = mdl.RangeSlider.slider()
  .withStyle(styles.slider)
  .withMin(10)
  .withMax(100)
  .withMinValue(30)
  .withMaxValue(50)
  .build();
…
<SliderWithRange
  ref=“sliderWithRange”
  onChange={(curValue) => this.setState({
    min: curValue.min,
    max: curValue.max,
    })
  }
  onConfirm={(curValue) => {
    console.log("Slider drag ended");
    console.log(curValue);
  }}
/>
```

👉 [props reference][range-slider-props-doc] and [example code][slider-sample]

[mdl-slider]: http://www.getmdl.io/components/index.html#sliders-section
[slider-demo]: https://cloud.githubusercontent.com/assets/390805/10123318/6c502e6e-6569-11e5-924a-62c8b850511c.gif
[range-slider-demo]: https://cloud.githubusercontent.com/assets/16245422/12763284/63a2dafc-c9a8-11e5-8fde-37b6f42a60c2.gif
[slider-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/sliders.js
[slider-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Slider.html#props
[range-slider-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/RangeSlider.html#props

### Text Fields

Built-in textfields, which comply with [Material Design Lite][mdl-tf].

[![img-tf]][mdl-tf]

```jsx
// textfield with default theme (configurable)
const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .build();

...
<Textfield />
```

Customizing textfields through builder:

```jsx
const CustomTextfield = mdl.Textfield.textfield()
  .withPlaceholder(‘Text…’)
  .withStyle(styles.textfield)
  .withTintColor(MKColor.Lime)
  .withTextInputStyle({color: MKColor.Orange})
  .build();
...
<CustomTextfield />
```

the jsx equivalent:

```jsx
<MKTextField
  tintColor={MKColor.Lime}
  textInputStyle={{color: MKColor.Orange}}
  placeholder=“Text…”
  style={styles.textfield}
/>
```

👉 [props reference][tf-props-doc] and [example code][tf-sample]

[mdl-tf]: http://www.getmdl.io/components/#textfields-section
[img-tf]: https://cloud.githubusercontent.com/assets/390805/9085678/8280484a-3bb1-11e5-9354-a244b0520736.gif
[tf-sample]: https://github.com/xinthink/rnmk-demo/blob/master/app/textfields.js
[tf-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Textfield.html#props

### Toggles

[Icon toggle][mdl-icon-toggle] & [Switch][mdl-switch]
[![img-toggles]][mdl-toggles]

[mdl-toggles]: http://www.getmdl.io/components/index.html#toggles-section
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
  <Text
    pointerEvents="none"
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
<mdl.Switch
  style={styles.appleSwitch}
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

#### Checkbox

[![img-checkbox]][mdl-checkbox]

```jsx
<MKCheckbox
  checked={true}
/>
```

You can customize the styles by changing the global theme, which affects all checkboxes across the whole app.

```js
setTheme({checkboxStyle: {
  fillColor: MKColor.Teal,
  borderOnColor: MKColor.Teal,
  borderOffColor: MKColor.Teal,
  rippleColor: `rgba(${MKColor.RGBTeal},.15)`,
}});
```

👉 [props reference][checkbox-props-doc] and [example code][toggles-sample]

[mdl-checkbox]: http://www.getmdl.io/components/index.html#toggles-section/checkbox
[img-checkbox]: https://cloud.githubusercontent.com/assets/390805/12009445/0f938cee-acb2-11e5-9732-434382f6cd84.gif
[checkbox-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/Checkbox.html#props


#### Radio button

[![img-radio]][mdl-radio]

```jsx
constructor() {
  super();
  this.radioGroup = new MKRadioButton.Group();
}
...
<MKRadioButton
  checked={true}
  group={this.radioGroup}
/>
```

You can customize the styles by changing the global theme, which affects all radio buttons across the whole app.

```js
setTheme({radioStyle: {
  fillColor: `rgba(${MKColor.RGBTeal},.8)`,
  borderOnColor: `rgba(${MKColor.RGBTeal},.6)`,
  borderOffColor: `rgba(${MKColor.RGBTeal},.3)`,
  rippleColor: `rgba(${MKColor.RGBTeal},.15)`,
}});
```

👉 [props reference][radio-props-doc] and [example code][toggles-sample]

[mdl-radio]: http://www.getmdl.io/components/index.html#toggles-section/radio
[img-radio]: https://cloud.githubusercontent.com/assets/390805/10442805/bdb08bc0-7188-11e5-8565-4ee0049ad590.gif
[radio-props-doc]: http://www.xinthink.com/react-native-material-kit/docs/lib/mdl/RadioButton.html#props


## About
This project is inspired by [MaterialKit][], thanks [@nghialv][] for the great work!👍🖖

But I rewrote almost all the components in JSX, with limited help of native code.

And lastly, it’s lots of work to be done, ***contributions*** are welcome!🎉🍻

[@nghialv]: https://github.com/nghialv
[MaterialKit]: https://github.com/nghialv/MaterialKit
