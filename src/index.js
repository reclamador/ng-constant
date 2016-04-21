'use strict';

var _ = require('underscore');
var fs = require('fs');
var yaml = require('js-yaml');
var path = require('path');
var through2 = require('through2');

var TEMPLATE_PATH = path.join(__dirname, 'tpls', 'constant.tpl.ejs');
var DEFAULT_WRAP_PATH = path.join(__dirname, 'tpls', 'default-wrapper.tpl.ejs');
var AMD_WRAP_PATH = path.join(__dirname, 'tpls', 'amd-wrapper.tpl.ejs');
var COMMONJS_WRAP_PATH = path.join(__dirname, 'tpls', 'commonjs-wrapper.tpl.ejs');
var ES6_WRAP_PATH = path.join(__dirname, 'tpls', 'es6-wrapper.tpl.ejs');
var TS_WRAP_PATH = path.join(__dirname, 'tpls', 'ts-wrapper.tpl.ejs');
var defaultWrapper, amdWrapper, commonjsWrapper, es6Wrapper, tsWrapper;

var defaults = {
  space: '\t',
  merge: false,
  deps: null,
  wrap: false,
  template: undefined,
  templatePath: TEMPLATE_PATH,
};

function ngConstant(opts) {
  var options = _.assign({}, defaults, opts);
  var template = options.template || readFile(options.templatePath);
  var stream = through2.obj(objectStream);

  return stream;

  function objectStream(chunk, enc, callback) {
    var self = this;

    try {
      var data = yaml.safeLoad(chunk.toString());

      // Create the module string
      var result = _.template(template)({
        moduleName: options.name,
        deps: options.deps,
        constants: getConstants(data, options),
      });

      result = wrap(result, options);

      self.push(new Buffer(result));

      callback();
    } catch (err) {
      callback(err, chunk);
    }
  }
}

function getConstants(data, options) {
  if (typeof options.constants === 'string') {
    options.constants = JSON.parse(options.constants);
  }

  var dataCnst = data.constants || data;
  var method = options.merge ? 'assign' : 'extend';
  var input = _[method]({}, dataCnst, options.constants);

  var constants = _.map(input, function (value, name) {
    return {
      name: name,
      value: stringify(value, options.space),
    };
  });

  return constants;
}

function wrap(input, options) {
  var wrapper = options.wrap || '<%= __ngModule %>';

  if (wrapper === true) {
    if (!defaultWrapper) { defaultWrapper = readFile(DEFAULT_WRAP_PATH); }
    wrapper = defaultWrapper;
  } else if (wrapper === 'amd') {
    if (!amdWrapper) { amdWrapper = readFile(AMD_WRAP_PATH); }
    wrapper = amdWrapper;
  } else if (wrapper === 'commonjs') {
    if (!commonjsWrapper) { commonjsWrapper = readFile(COMMONJS_WRAP_PATH); }
    wrapper = commonjsWrapper;
  } else if (wrapper === 'es6') {
    if (!es6Wrapper) { es6Wrapper = readFile(ES6_WRAP_PATH); }
    wrapper = es6Wrapper;
  } else if (wrapper === 'typescript') {
    if (!tsWrapper) { tsWrapper = readFile(TS_WRAP_PATH); }
    wrapper = tsWrapper;
  }

  return _.template(wrapper)(_.assign({ '__ngModule': input }, options));
}

function readFile(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}

function stringify(value, space) {
  return _.isUndefined(value) ? 'undefined' : JSON.stringify(value, null, space);
}

_.extend(ngConstant, {
  getConstants: getConstants,
});

module.exports = ngConstant;
