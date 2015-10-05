# Contributing to React Native Material Kit

Thank you for contributing to [RNMK]! :metal:

## Reporting Bugs

- Before filing a new task, try to make sure it doesn't already exist.
- Provide environment informations, such as RN version, RNMK version, OS version etc.
- Provide error logs or stack trace if possible. For UI issues, screenshots are helpful.
- Try to provide a reduced test case. Either a public repository with a runnable example or a [React Native Playground](https://rnplay.org/) snippet.

## Component Contributions

- Test your components on both iOS and Android platform
- ***Try*** to keep compatible with the oldest version of RN which RNMK supports ([Where to find it?][rnmk-rn-version])
- Demonstrating the new components in [RNMK Demos]
- Add showcases and brief examples to `README.md`
- Components should be organized in alphabet order

[rnmk-rn-version]: https://github.com/xinthink/react-native-material-kit/blob/master/package.json#L25
[RNMK Demos]: https://github.com/xinthink/rnmk-demo

## Style Guide for Code Contributions

### General

* Replacing tabs with spaces
* End files with a single newline character
* "Attractive"

### JavaScript/JSX

* 2 spaces for indentation (no tabs)
* Prefer ES6/ES7 syntax
* Add trailing commas, ([*Why?*](https://github.com/airbnb/javascript#19.2))
* Use single-line comments with markdown syntax for documentation (I’m using a documentation generator called [Docco])
* [Airbnb JavaScript Style Guide]
* [Airbnb React/JSX Style Guide]

[Airbnb JavaScript Style Guide]: https://github.com/airbnb/javascript
[Airbnb React/JSX Style Guide]: https://github.com/airbnb/javascript/tree/master/react
[Docco]: https://jashkenas.github.io/docco/

### Objective-C

* Space after `@property` declarations
* Brackets on *every* `if`, on the *same* line
* `- method`, `@interface`, and `@implementation` brackets on the following line
* *Try* to keep it around 80 characters line length (sometimes it's just not possible...)
* `*` operator goes with the variable name (e.g. `NSObject *variableName;`)
* [Objective-C Style Guide]

[Objective-C Style Guide]: https://github.com/raywenderlich/objective-c-style-guide

### Java

* [Java Style Guide]

[Java Style Guide]: https://github.com/raywenderlich/java-style-guide

## License

By contributing to [React Native Material Kit][RNMK], you agree that your contributions will be licensed under its [MIT license].

[RNMK]: https://github.com/xinthink/react-native-material-kit
[MIT license]: https://raw.githubusercontent.com/xinthink/react-native-material-kit/master/LICENSE.md
