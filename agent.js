'use strict';

const path = require('path');
// const fs = require('mz/fs');
const spawn = require('cross-spawn');
const Base = require('sdk-base');
const awaitEvent = require('await-event');
const detectPort = require('detect-port');

class DevServer extends Base {
  constructor(app) {
    super({
      initMethod: 'init',
    });
    this.app = app;
    this.isClosed = false;
  }

  async init() {

    const logger = this.app.coreLogger;

    const config = this.app.config.devServer;

    const availablePort = await detectPort(config.port);

    config.port = availablePort;

    // this.app.config.cluster.listen.port
    this.commandStr = `vue-cli-service serve --port ${config.port}`;

    const [ command, ...args ] = this.commandStr.split(/\s+/);

    const proc = this.proc = spawn(command, args, {
      stdio: [ 'inherit', 'pipe', 'inherit' ],
      env: {
        VUE_CLI_SERVICE_CONFIG_PATH: path.resolve(this.app.config.baseDir, 'app/web/vue.config.js'),
      },
      cwd: path.resolve(this.app.config.baseDir),
    });

    proc.once('error', err => this.exit(err));
    proc.once('exit', code => this.exit(code));

    proc.on('error', err => {
      console.log('error-----', err);
    });

    proc.stdout.on('data', data => {
      const match = data.toString().match(/localhost:(\d+)/);
      if (match) {
        const port = match[1];
        logger.warn('[egg-dev-server] compile success, listen on %s', port);
      }
    });


  }

  async close() {
    this.isClosed = true;
    /* istanbul ignore if */
    if (!this.proc) return;
    this.app.coreLogger.warn('[egg-dev-server] dev server will be killed');
    this.proc.kill();
    await awaitEvent(this.proc, 'exit');
    this.proc = null;
  }

  exit(codeOrError) {
    const logger = this.app.coreLogger;
    this.proc = null;

    if (!(codeOrError instanceof Error)) {
      const code = codeOrError;
      const message = `[egg-dev-server] Run "${this.commandStr}" exit with code ${code}`;
      if (!code || code === 0) {
        logger.info(message);
        return;
      }

      codeOrError = new Error(message);
    }

    logger.error(codeOrError);
  }

}


const startDevServer = agent => {
  const config = agent.config.devServer;

  if (!config) return;

  const server = new DevServer(agent);

  server.ready(err => {
    if (err) agent.coreLogger.error('[egg-dev-server]', err.message);
  });

  agent.beforeClose(async () => {
    await server.close();
  });

};


module.exports = agent => {

  // 也可以通过 messenger 对象发送消息给 App Worker
  // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失

  // agent.messenger.on('egg-ready', () => {
  //   const data = { };
  //   agent.messenger.sendToApp('xxx_action', data);
  // });

  startDevServer(agent);

};
