const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'https://ecommtest.wuaze.com',
      changeOrigin: true,
      pathRewrite: {
        '^/graphql': '/graphql', // rewrite path
      },
      secure: false,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: function(err, req, res) {
        console.log('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Something went wrong with the proxy.');
      }
    })
  );
};