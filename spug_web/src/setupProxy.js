
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(proxy('/api/', {
    target: 'http://192.168.10.10:28081',
    changeOrigin: true,
    // ws: true,
    // headers: {'X-Real-IP': '1.1.1.1'},
    // pathRewrite: {
    //   '^/api': '/api'
    // }
  }))
  // app.use(proxy('/api/', {
  //   target: 'http://8.130.51.9:28080',
  //   changeOrigin: true,
  //   // ws: true,
  //   // headers: {'X-Real-IP': '1.1.1.1'},
  //   // pathRewrite: {
  //   //   '^/api': '/api'
  //   // }
  // }))
  app.use(proxy('/myapi/', {
    target: 'http://192.168.10.10:9090/',
    changeOrigin: true,
    // ws: true,
    // headers: {'X-Real-IP': '1.1.1.1'},
    pathRewrite: {
      '^/myapi': '/api'
    }
  }))
};

