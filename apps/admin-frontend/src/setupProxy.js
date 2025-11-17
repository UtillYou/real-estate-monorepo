const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true
    })
  );
};
