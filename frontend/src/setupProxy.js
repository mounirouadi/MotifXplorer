const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true,
            logLevel: 'debug',
            pathRewrite: {
                '^/api': '', // Rewrite /api/process -> /process
            },
            onProxyReq: (proxyReq, req, res) => {
                // Log proxy requests for debugging
                console.log('Proxying request:', req.method, req.url, '->', 'http://backend:4000' + req.url);
            },
            onError: (err, req, res) => {
                console.error('Proxy error:', err);
            }
        })
    );
};
