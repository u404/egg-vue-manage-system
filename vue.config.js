const path = require('path');

module.exports = {
  //   baseUrl: './',
  publicPath: 'http://localhost:8002',

  configureWebpack: {
    context: path.resolve(process.cwd(), 'app/web'),

    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  },

  assetsDir: 'static',
  productionSourceMap: false,
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
