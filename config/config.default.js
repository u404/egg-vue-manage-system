/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594802648263_7344';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.cluster = {
    listen: {
      path: '',
      port: 8001,
      hostname: '0.0.0.0',
    },
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.httpProxy = {
    '/assets': 'http://localhost:8002',
    '/sockjs-node': 'http://localhost:8002',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.devServer = appInfo.env === 'local' && {
    port: 8002,
  };

  return {
    ...config,
    ...userConfig,
  };
};
