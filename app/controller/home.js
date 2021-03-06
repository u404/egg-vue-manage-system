'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.helper.renderWebApp();
  }
}

module.exports = HomeController;
