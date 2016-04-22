var fs = require('fs');
var ngConstant = require('../src');

var file = [];

fs.createReadStream('config.json')
  .pipe(ngConstant({
    name: 'app.config',
    deps: ['ngAnimate'],
    stream: true,
    constants: { john: 'doe' },
    wrap: 'es6',
  }))
  .on('data', function (data) {
    file.push(data);
  })
  .on('end', function () {
    console.log(file.toString());
  });
