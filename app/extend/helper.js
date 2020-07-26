
'use strict';

const path = require('path');
const fs = require('fs');


const scriptTpl = (src = '') => {
  return `<script src="${src}"></script>`;
};

module.exports = {
  getLinks() {
    const { config } = this.app;
    if (this.app.config.env === 'local') {
      return '';
    }
    if (!this.app.config._links) {
      try {
        if (!config._html) {
          config._html = fs.readFileSync(path.resolve(this.app.config.baseDir, 'app/web/dist/index.html')).toString();
        }
        this.app.config._links = config._html.match(/<link.+?>/g).join('');
      } catch (e) {
        this.app.config._links = '';
      }
    }
    return this.app.config._links;
  },
  getBodyContent() {
    const { config } = this.app;
    if (config.env === 'local') {
      return scriptTpl('/assets/app.js');
    }
    if (!config._bodyContent) {
      try {
        if (!config._html) {
          config._html = fs.readFileSync(path.resolve(this.app.config.baseDir, 'app/web/dist/index.html')).toString();
        }
        this.app.config._bodyContent = config._html.match(/<body>(.+?)<\/body>/)[1];
      } catch (e) {
        this.app.config._bodyContent = `<div>${e.message}</div>`;
      }
    }
    return this.app.config._bodyContent;
  },
};
