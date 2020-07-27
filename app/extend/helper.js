
'use strict';

const path = require('path');
const fs = require('fs');


const scriptTpl = (src = '') => {
  return `<script src="${src}"></script>`;
};

module.exports = {
  getLinks() {
    const { config } = this.app;
    if (config.env === 'local') {
      return '';
    }
    if (!config._links) {
      try {
        if (!config._html) {
          config._html = fs.readFileSync(path.resolve(config.baseDir, 'app/web/dist/index.html')).toString();
        }
        config._links = config._html.match(/<link.+?>/g).join('');
      } catch (e) {
        config._links = '';
      }
    }
    return config._links;
  },
  getBodyContent() {
    const { config } = this.app;
    if (config.env === 'local') {
      try {
        if (!config._html) {
          config._html = fs.readFileSync(path.resolve(config.baseDir, 'app/web/public/index.html')).toString();
        }
        config._bodyContent = config._html.match(/<body>([\s\S]+?)<\/body>/)[1].trim();
      } catch (e) {
        config._bodyContent = `<div>${e.message}</div>`;
      }

      return config._bodyContent + scriptTpl('/assets/app.js');
    }
    if (!config._bodyContent) {
      try {
        if (!config._html) {
          config._html = fs.readFileSync(path.resolve(config.baseDir, 'app/web/dist/index.html')).toString();
        }
        config._bodyContent = config._html.match(/<body>([\s\S]+?)<\/body>/)[1];
      } catch (e) {
        config._bodyContent = `<div>${e.message}</div>`;
      }
    }
    return config._bodyContent;
  },
};
