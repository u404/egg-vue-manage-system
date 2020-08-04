'use strict'

module.exports = {

  publicPath: 'web/',

  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "src/common/styles/mixins.scss";'
      }
    },
    modules: false
  }
}
