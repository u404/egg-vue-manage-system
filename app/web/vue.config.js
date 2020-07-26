'use strict';

const path = require('path');

console.log('path', path.resolve(__dirname));

module.exports = {
  //   baseUrl: './',
  publicPath: 'assets/',

  outputDir: path.resolve(__dirname, 'dist'),

  configureWebpack: {
    context: path.resolve(__dirname),

    // devServer: {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   },
    // },
  },

  // assetsDir: 'static',
  // productionSourceMap: false,
  // devServer: {
  //     proxy: {
  //         '/api':{
  //             target:'http://jsonplaceholder.typicode.com',
  //             changeOrigin:true,
  //             pathRewrite:{
  //                 '/api':''
  //             }
  //         }
  //     }
  // }
};
