module.exports = ({app, backend}) => {

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/version', function (req, res) {
        res.send({
            version: require('../../version')
        });
    });

    app.get('/about', function (req, res) {
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
    
};