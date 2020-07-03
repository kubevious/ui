class MiscService {

    constructor(client)
    {
        this._client = client;
    }

    fetchAbout(cb) {
        var info = {
            version: require('../version')
        }
                  
        return Promise.resolve()
            .then(() => {
                return this._client.get('/version')
                    .then(result => {
                        info['backend version'] = result.data.version;
                    })
                    .catch(reason => {
                        info['backend version'] = "unknown";
                    });
            })
            .then(() => {
                cb(info);
            });
  
    }
}

export default MiscService
