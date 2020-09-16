const _ = require('the-lodash');

class MiscService {

    constructor(client)
    {
        this._client = client;
    }

    fetchAbout(cb) {
        let info = [];

        info.push({
            name: 'UI Version',
            value: require('../version')
        })
                  
        return Promise.resolve()
            .then(() => {
                return this._client.get('/api/v1/version')
                    .then(result => {
                        return result.data.version;
                    })
                    .catch(reason => {
                        return "unknown";
                    });
            })
            .then(result => {
                info.push({
                    name: 'Backend Version',
                    value: result
                })
            })
            .then(() => {
                return this._client.get('/api/v1/metrics')
                    .then(result => {
                        info = _.concat(info, result.data.metrics);
                    })
                    .catch(reason => {
                        console.error(reason);
                    });
            })
            .then(() => {
                cb(info);
            });
  
    }
}

export default MiscService
