#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var shell = require('shelljs');

var config = require('../lib/config');

var main = require(config.appRoot);
if (main.__esModule) { // eslint-disable-line no-underscore-dangle
  main = main.default;
}
var render = (typeof main === 'function') ? main : function () {
  return Promise.resolve('');
};

var getFileName = config.getFileName || function (url, distDir) {
  var segments = url.split('/').filter(function(segment) {
    return segment.length;
  });
  if (
    !segments.length ||
    segments[segments.length - 1].indexOf('.') === -1
  ) {
    segments.push('index.html');
  }
  segments.unshift(distDir);
  return path.join.apply(path, segments);
};

function renderShells(options) {
  config.shells.forEach(function(url) {
    var fileName = getFileName(url, config.distDir);
    render(url, options)
    .then(function(body) {
      shell.mkdir('-p', path.dirname(fileName));
      fs.writeFile(fileName, body);
    })
    .catch(shell.echo);
  });
}

exports.renderShells = renderShells;

if (require.main === module) {
  renderShells();
}
