const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:4000',
            changeOrigin: true,
            logLevel: 'debug',
            pathRewrite: {
                // If the backend expects /api prefix, keep it. 
                // If the backend routes are just /process, /kmer, etc., we might need to rewrite.
                // Based on previous code, the backend has @app.route('/api/process'), so NO rewrite needed.
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
