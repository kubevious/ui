const _ = require("the-lodash");

module.exports = ({app, router, history}) => {

    router.get('/range', function(req, res) {
        return history.queryTimelineRange()
            .then(data => {
                var info = _.head(data);
                if (!info) {
                    info = {};
                }
                if (!info.max_date) {
                    info.max_date = new Date();
                } else {
                    info.max_date = new Date(info.max_date);
                }
                if (!info.min_date) {
                    info.min_date = info.max_date;
                } else {
                    info.min_date = new Date(info.min_date);
                }
                return res.send(info);
            })

    });

    router.get('/timeline', function(req, res) {
        var dateFrom = null;
        if (req.query.from) {
            dateFrom = new Date(req.query.from);
        }
        var dateTo = null;
        if (req.query.to) {
            dateTo = new Date(req.query.to);
        }

        return history.queryTimeline(dateFrom, dateTo)
            .then(data => {
                var result = data.map(x => {
                    return {
                        date: x.date,
                        items: x.summary.delta.items, //x.summary.snapshot.items
                        alerts: x.summary.snapshot.alerts,
                    }
                });
                return res.send(result);
            });
    });


    router.get('/snapshot', function(req, res) {
        if (!req.query.date) {
            return res.status(400).send({
                message: 'Missing date.'
             });
        }

        return history.querySnapshotForDate(req.query.date)
            .then(snapshot => {
                if (!snapshot) {
                    return res.send({});
                }
                return res.send(snapshot.getItems());
            })
    });

    app.use('/api/v1/history', router);
};