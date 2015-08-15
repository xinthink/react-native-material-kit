# react-native-material-kit
A set of [React Native][rn] components, complying with the [Material Design][md] Specifications.

[![GitHub stars][gh-badge]][gh]
[![MIT][license-badge]][license]

[rn]: https://facebook.github.io/react-native
[md]: http://www.google.com/design/spec/material-design/introduction.html
[license-badge]: https://img.shields.io/dub/l/vibe-d.svg
[license]: https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md
[gh-badge]: https://img.shields.io/github/stars/xinthink/react-native-material-kit.svg?style=social
[gh]: https://github.com/xinthink/react-native-material-kit

## [Plug-and-play!][gh-comp]

![buttons-mdl][img-buttons]
![textfields-mdl][img-tf]
![toggles-mdl][img-toggles]
![progress-mdl][img-progress]
![spinner-mdl][img-spinner]

[gh-comp]: https://github.com/xinthink/react-native-material-kit#components
[img-buttons]: https://cloud.githubusercontent.com/assets/390805/8888853/69f8d9f8-32f2-11e5-9823-c235ab8c0dd2.gif
[img-tf]: https://cloud.githubusercontent.com/assets/390805/9085678/8280484a-3bb1-11e5-9354-a244b0520736.gif
[img-toggles]: https://cloud.githubusercontent.com/assets/390805/8903074/de0ed748-3487-11e5-9448-9ee304e0a6b6.gif
[img-progress]: https://cloud.githubusercontent.com/assets/390805/9288698/01e31432-4387-11e5-98e5-85b18471baeb.gif
[img-spinner]: https://cloud.githubusercontent.com/assets/390805/9288699/01e3573a-4387-11e5-8f7b-6c34066846fe.gif

## Getting Started

`cd` to your RN project directory,

1. `npm i -S react-native-material-kit`
2. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
3. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to build target's `Linked Frameworks and Libraries` list
4. `require('react-native-material-kit')` to start using the components, in js files
5. Have fun!


## Links
- [GitHub][gh]
- [Docs (annotated source)][docs]
- [Examples][examples]
- [Change logs][releases]

[docs]: http://xinthink.github.io/react-native-material-kit/docs/index.html
[examples]: https://github.com/xinthink/react-native-material-kit/blob/master/Example
[releases]: https://github.com/xinthink/react-native-material-kit/releases
