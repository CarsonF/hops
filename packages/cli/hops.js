#!/usr/bin/env node
'use strict';

var program = require('commander');
var rimraf = require('rimraf');

var hopsConfig = require('hops-config');

program
.version(require('./package.json').version)
.description('Commands: start, serve, develop, build')
.arguments('<command>')
.action(function run (command) {
  rimraf(hopsConfig.buildDir, function () {
    switch (command) {
      case 'start':
        return run(process.env.NODE_ENV === 'production' ? 'serve' : 'develop');
      case 'serve':
        return require('./commands/serve')();
      case 'develop':
        return require('./commands/develop')();
      case 'build':
        return require('./commands/build')();
      default:
        console.error('invalid command: ' + command);
        process.exit(1);
    }
  });
})
.parse(process.argv);
