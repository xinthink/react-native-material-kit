# [Material Design](http://www.google.com/design/spec/material-design/introduction.html) components for [React Native](https://facebook.github.io/react-native)

[![DUB](https://img.shields.io/dub/l/vibe-d.svg)](https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md)

This is a port of [MaterialKit](https://github.com/nghialv/MaterialKit) (written in Swift) to Objective-C, so that it can be used in [React Native](https://facebook.github.io/react-native) projects, as a static library.

Thanks to the great work of [@nghialv](https://github.com/nghialv)!


## Getting Started

`CD` to your React Native project,

1. `npm i -S react-native-material-kit`
2. Add `node_modules/react-native-material-kit/iOS/RCTMaterialKit.xcodeproj` to your xcode project, usually under the `Libraries` group
3. Add `libRCTMaterialKit.a` (from `Products` under `RCTMaterialKit.xcodeproj`) to the target's `Linked Frameworks and Libraries` list
4. `require('react-native-material-kit')` to start using the components, in js files
5. Have fun!

* [Demo](https://github.com/xinthink/react-native-material-kit#components)
* [Code sample](https://github.com/xinthink/react-native-material-kit/blob/master/Example)
