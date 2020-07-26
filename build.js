'use strict';

const path = require('path');
const spawn = require('cross-spawn');

const cwd = process.cwd();

spawn('vue-cli-service', [ 'build' ], {
  stdio: [ 'inherit', 'pipe', 'inherit' ],
  env: {
    VUE_CLI_SERVICE_CONFIG_PATH: path.resolve(cwd, 'app/web/vue.config.js'),
  },
  cwd: path.resolve(cwd),
});
