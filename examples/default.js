var ngConstant = require('../src');

var file = ngConstant({
  name: 'app.config',
  deps: ['ngAnimate'],
  constants: { john: 'doe' },
  wrap: 'es6',
});

console.log(file);
