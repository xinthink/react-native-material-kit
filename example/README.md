# Example APP

## Build & run the example app

Checkout the [repo] first.

Build & launch:

```sh
yarn # install dependencies 

cd example
yarn # install dependencies of the example app 
(cd iOS && pod install) # prepare iOS xcode workspace
yarn start # start the react-native packager
yarn ios # or yarn android, launch the example app
```

Available npm scripts:
- `yarn start` to start the dev server
- `yarn ios` build your app and starts it on iOS simulator
- `yarn iosx` build your app and starts it on iPhone X simulator
- `yarn android` build your app and starts it on a connected Android emulator or device
- or run any `react-native` commands: `yarn cli [options] [command]`

## Resources

- :point_right: [Getting Started Guide]
- :point_right: [API Docs]

[repo]: https://github.com/xinthink/react-native-material-kit
[Getting Started Guide]: https://github.com/xinthink/react-native-material-kit#getting-started
[API Docs]: https://rnmk.xinthink.com/api/react-native-material-kit/
