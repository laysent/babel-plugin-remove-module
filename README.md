# babel-plugin-transform-string-join

Babel plugin that will remove certain module usage from code.

Using this plugin might be dangourse as it will remove code that you might want to keep. Use at your
own risk.

## Examples

Suppose you would like to remove certain validation library in production code. Here is what this
plugin can do:

**In**

```js
import * as paramTypes from 'param-types';

const validation = paramTypes.validate(
  'function validation',
  paramTypes.string.isRequired,
  paramTypes.number.isRequired
);

function regularFunction(paramA, paramB) {
  validate(paramA, paramB);
  console.log('do something normal here');
}

regularFunction('1', 1);
```

**Out**

```js
import * as paramTypes from 'param-types';

/*
 * const validation = paramTypes.validate(
 *   'function validation',
 *   paramTypes.string.isRequired,
 *   paramTypes.number.isRequired
 * );
 */

function regularFunction(paramA, paramB) {
  /* validate(paramA, paramB); */
  console.log('do something normal here');
}

regularFunction('1', 1);
```

## Installation

```sh
$ npm install babel-plugin-strip-module
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [["strip-module", { "modules": ["module name here"] }]]
}
```

### Via Node API

```javascript
require('babel-core').transform('code', {
  plugins: [['strip-module', { modules: ['module name here'] }]],
});
```

## License

MIT
