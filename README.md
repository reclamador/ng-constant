# ng-constant

Node module that creates an angular constants file from data (like JSON file)

#### Based on [gulp-ng-constant](https://github.com/guzart/gulp-ng-constant)

## Usage

`index.js`

```javascript
var fs = require('fs');
var ngConstant = require('ngConstant');

var file = [];

fs.createReadStream('app/config.json')
  .pipe(ngConstant({
    name: 'app.config',
    deps: ['ngAnimate'],
    constants: { john: 'doe' },
    wrap: 'es6',
  }))
  .on('data', function (data) {
    file.push(data);
  })
  .on('end', function () {
    console.log(file.toString());
  });
```

_**app/config.json**_
```json
{
  "foo": true,
  "bar": { "hello": "world" }
}
```

_(output)_

```javascript
'use strict';

import angular from 'angular';

let env = angular.module("app.config", ["ngAnimate"])

.constant("foo", true)

.constant("bar", {
  "hello": "world"
})

.constant("john", "doe")

;

export default env;
```

## Options

#### options.name

Type: `string`
Default: `filename` or `"ngConstants"`
Overrides: `json.name`
_optional_

The module name.
This property will override any `name` property defined in the input `json` file. The default name when used as a transform stream (i.e. regular plugin) is the passed file name.

#### options.constants

Type: `Object | string`
Default: `undefined`
Exends/Overrides: `json.constants`

Constants to defined in the module.
Can be a `JSON` string or an `Object`.
This property extends the one defined in the input `json` file. If there are
properties with the same name, this properties will override the ones from the
input `json` file.

#### options.merge

Type: `boolean`
Default: `false`
_optional_

This applies to constants of the Object type.
If true the constants of type Object from the input file and the constants
from the configuration will be merged.

#### options.deps

Type: `array<string>|boolean`
Default: `[]`
Overrides: `json.deps`
_optional_

An array that specifies the default dependencies a module should have. To add the constants to an existing module, you can set it to `false`.
This property will override any `deps` property defined in the input `json` file.

#### options.wrap

Type: `boolean|string`
Default: `false`
Available: `['amd', 'commonjs', 'es6', 'typescript']`
_optional_

A boolean to active or deactive the automatic wrapping.
A string who will wrap the result of file, use the
`<%= __ngModule %>` variable to indicate where to put the generated
module content.
A string with 'amd' that wraps the module as an AMD module,
compatible with RequireJS

#### options.space

Type: `string`
Default: `'\t'`
_optional_

A string that defines how the JSON.stringify method will prettify your code.

#### options.template

Type: `string`
Default: _content of [tpls/constant.tpl.ejs](https://github.com/tiste/ng-constant/blob/master/tpls/constant.tpl.ejs)_
_optional_

EJS template to apply when creating the output configuration file. The following variables
are passed to the template during render:

  * `moduleName`: the module name (`string`)
  * `deps`: the module dependencies (`array<string>`)
  * `constants`: the module constants (`array<constantObj>`)
    * where a `constantObj` is an object with a `name` and a `value`, both `strings`.

#### options.templatePath

Type: `string`
Default: `'tpls/constant.tpl.ejs'`
_optional_

Location of a custom template file for creating the output configuration file. Defaults to the provided constants template file if none provided.
