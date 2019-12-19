module.exports = ({router, app, logger, backend}) => {

    router.get('/tree', function (req, res) {
        return backend.get("/api/tree")
            .then(result => {
                res.send(result.data);
            });
    })

    router.get('/properties', function (req, res) {
        return backend.get("/api/properties", { dn: req.query.dn })
            .then(result => {
                res.send(result.data);
            });
    })

    app.use('/api', router);
};