/**
 * Created by ywu on 15/7/18.
 */

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach((name) => {
  exports[`is${name}`] = (obj) => {
    return toString.call(obj) === `[object ${name}]`;
  };
});

function mergeIntoFast(a, b) {
  for (let k in b) {
    a[k] = b[k];
  }
}

exports.mergeIntoFast = mergeIntoFast;
