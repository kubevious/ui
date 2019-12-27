var proxy = require('http-proxy-middleware');

module.exports = ({router, app, logger, backend}) => {

    app.use(
        '/api',
        proxy({ target: backend.rootUrl, changeOrigin: true })
    );
    
};