const Docs = require("kubevious-helpers").Docs;

module.exports = ({app, router, backend}) => {

    router.get('/', function(req, res) {
        res.render('index');
    });

    router.get('/version', function (req, res) {
        res.send({
            version: require('../../version')
        });
    });

    router.get('/about', function (req, res) {
        var info = {
            version: require('../../version')
        }

        return Promise.resolve()
            .then(() => {
                return backend.get('/version')
                    .then(result => {
                        info['backend version'] = result.data.version;
                    })
                    .catch(reason => {
                        info['backend version'] = "unknown";
                    });
            })
            .then(() => {
                return res.send(info);
            });

    });

    router.get('/docs.js', function (req, res) {
        var params = {
            kinds: Docs.KIND_TO_USER_MAPPING,
            flags: Docs.FLAG_TOOLTIPS
        }
        res.render('docs.js', params);
    });
    
    app.use('/', router);
};