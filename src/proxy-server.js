// src/proxy-server.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Proxy requests starting with /graphql to your backend
app.use(
  '/graphql',
  createProxyMiddleware({
    target: 'https://ecommtest.wuaze.com',
    changeOrigin: true,
    secure: true, // set to true if your backend has a valid SSL certificate
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
