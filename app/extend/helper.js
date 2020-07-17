
'use strict';

module.exports = {
  asset(src) {
    return `http://localhost:${this.app.config.devServer.port}/${src}`;
  },
};
