# react-native-material-kit demo

## RNMK resources
- [GitHub][RNMK]
- [Docs (annotated source)][docs]
- [Change logs][releases]

## Debugging local RNMK module

- Checkout [RNMK Demo]
- Clone [RNMK] into the *Libraries* directory (inside the demo project)
- Edit `react-native.config.js` file, replace `<absolute_project_root>` with your local project directory
- Link your local RNMK module to the demo project
  ```sh
  cd rnmk-demo
  yarn

  (cd Libraries/react-native-material-kit && yarn && yarn build)
  (cd iOS && pod install)
  ```
- Commands
  - `yarn start` to start the dev server
  - `yarn iosx` build your app and starts it on iOS simulator
  - `yarn android` build your app and starts it on a connected Android emulator or device
  - or run any `react-native` commands: `yarn cli [options] [command]`

## License
[MIT][license]

[RNMK Demo]: https://github.com/xinthink/rnmk-demo
[RNMK]: https://github.com/xinthink/react-native-material-kit
[docs]: http://xinthink.github.io/react-native-material-kit/docs/index.html
[releases]: https://github.com/xinthink/react-native-material-kit/releases
[license]: https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md
[doesn't resolve symbolic links]: https://github.com/facebook/react-native/issues/637
[ios guide]: https://github.com/xinthink/react-native-material-kit#ios
