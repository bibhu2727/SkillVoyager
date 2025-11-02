const https = require('https');
const http = require('http');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Generate a simple self-signed certificate for localhost
const selfsigned = require('selfsigned');
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

// Create a simple HTTPS server that serves the app
const app = express();

// Add permissions policy headers to allow camera and microphone access
app.use((req, res, next) => {
  // Set permissions policy to allow camera and microphone
  res.setHeader('Permissions-Policy', 'camera=*, microphone=*, geolocation=*');
  
  // Set feature policy for older browsers
  res.setHeader('Feature-Policy', 'camera *; microphone *; geolocation *');
  
  // Additional security headers for HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  next();
});

// Proxy all requests to the Next.js dev server
const proxy = createProxyMiddleware({
  target: 'http://localhost:9002',
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying for hot reload
  logLevel: 'silent',
  onProxyRes: (proxyRes, req, res) => {
    // Ensure permissions policy headers are preserved
    if (!proxyRes.headers['permissions-policy']) {
      proxyRes.headers['permissions-policy'] = 'camera=*, microphone=*, geolocation=*';
    }
    if (!proxyRes.headers['feature-policy']) {
      proxyRes.headers['feature-policy'] = 'camera *; microphone *; geolocation *';
    }
  }
});

app.use('/', proxy);

// Create HTTPS server
const server = https.createServer({
  key: pems.private,
  cert: pems.cert
}, app);

const PORT = 9003;

server.listen(PORT, () => {
  console.log(`🔒 HTTPS Server running on https://localhost:${PORT}`);
  console.log(`📡 Proxying to Next.js dev server on http://localhost:9002`);
  console.log(`🎥 Camera and microphone access enabled!`);
});