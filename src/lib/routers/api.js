var proxy = require('http-proxy-middleware');

module.exports = ({router, app, logger, backend}) => {

    if (process.env.MOCK_BACKEND) {
        return;
    }
    
    app.use(
        '/api',
        proxy({ target: backend.rootUrl, changeOrigin: true })
    );
    
};