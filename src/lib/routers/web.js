module.exports = ({app}) => {

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/version', function (req, res) {
        res.send({
            version: require('../../version')
        });
    });
    
};