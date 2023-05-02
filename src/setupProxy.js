const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.prod.rabbitx.io',
      changeOrigin: true,
      pathRewrite: {'^/api' : ''}
    })
  );
};