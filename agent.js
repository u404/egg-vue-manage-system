'use strict';

const path = require('path');
// const fs = require('mz/fs');
const spawn = require('cross-spawn');
const Base = require('sdk-base');
// const sleep = require('mz-modules/sleep');
// const awaitEvent = require('await-event');
const detectPort = require('detect-port');
const is = require('is-type-of');

class DevServer extends Base {
  constructor(app) {
    super({
      initMethod: 'init',
    });
    this.app = app;
    this.isClosed = false;
  }

  async init() {

    const config = this.app.config.devServer;

    const availablePort = await detectPort(config.port);

    config.port = availablePort;

    // this.app.config.cluster.listen.port
    this.commandStr = `vue-cli-service serve --public http://localhost:${config.port} --port ${config.port}`;

    const [ command, ...args ] = this.commandStr.split(/\s+/);

    const proc = this.proc = spawn(command, args, {
      stdio: [ 'inherit', 'ignore', 'inherit' ],
      env: {},
      cwd: path.resolve(this.app.config.baseDir),
    });
    proc.once('error', err => this.exit(err));
    proc.once('exit', code => this.exit(code));

    // start dev server asynchronously
    // this.startAsync();
    // await this.waitListen();
  }

  // async checkPortExist() {
  //   const { devServer } = this.app.config.assets;
  //   const port = await detectPort(devServer.port);
  //   debug('check %s, get result %s', devServer.port, port);
  //   return port !== devServer.port;
  // }

  // async waitListen() {
  //   const logger = this.app.coreLogger;
  //   const { devServer } = this.app.config.assets;
  //   let timeout = devServer.timeout / 1000;
  //   let isSuccess = false;
  //   while (timeout > 0) {
  //     /* istanbul ignore if */
  //     if (this.isClosed) {
  //       logger.warn('[egg-view-assets] Closing, but devServer is not listened');
  //       return;
  //     }
  //     if (await this.checkPortExist()) {
  //       logger.warn('[egg-view-assets] Run "%s" success, listen on %s', devServer.command, devServer.port);
  //       // 成功启动
  //       isSuccess = true;
  //       break;
  //     }
  //     timeout--;
  //     await sleep(1000);
  //     debug('waiting, %s remain', timeout);
  //   }

  //   if (isSuccess) return;
  //   const err = new Error(`Run "${devServer.command}" failed after ${devServer.timeout / 1000}s`);
  //   throw err;
  // }

  // async close() {
  //   this.isClosed = true;
  //   /* istanbul ignore if */
  //   if (!this.proc) return;
  //   this.app.coreLogger.warn('[egg-view-assets] dev server will be killed');
  //   this.proc.kill();
  //   await awaitEvent(this.proc, 'exit');
  //   this.proc = null;
  // }

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

  replacePort(str) {
    if (!is.string(str)) return str;
    return str.replace('{port}', this.app.config.assets.devServer.port);
  }

}


const startDevServer = agent => {
  const config = agent.config.devServer;

  if (!config) return;

  const server = new DevServer(agent);

  server.ready(err => {
    if (err) agent.coreLogger.error('[egg-dev-server]', err.message);
  });

  // if (config.waitStart) {
  //   agent.beforeStart(async () => {
  //     await server.ready();
  //   });
  // }

  agent.beforeClose(async () => {
    await server.close();
  });

};


module.exports = agent => {
  // 在这里写你的初始化逻辑

  // 也可以通过 messenger 对象发送消息给 App Worker
  // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失
  agent.messenger.on('egg-ready', () => {
    const data = { };
    agent.messenger.sendToApp('xxx_action', data);
  });

  startDevServer(agent);

};
