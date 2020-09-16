class MiscService {

    constructor(client)
    {
        this._client = client;
    }

    fetchAbout(cb) {
        var info = {
        }

        info['UI Version'] = require('../version');
                  
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
                info['Backend Version'] = result;
            })
            .then(() => {
                return this._client.get('/api/v1/metrics')
                    .then(result => {
                        for(var metric of result.data.metrics)
                        {
                            info[metric.name] = metric.value;
                        }
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
