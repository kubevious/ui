class MockMiscService {
    constructor(parent) {
        this._parent = parent
    }

    fetchAbout(cb) {
        var info = {
            version: require('../version'),
        }

        return Promise.resolve()
            .then(() => {
                return Promise.resolve()
                    .then(() => {
                        info['backend version'] = 'v1.2.3';
                    })
                    .catch(() => {
                        info['backend version'] = 'unknown';
                    });
            })
            .then(() => {
                cb(info)
            })
    }

}

export default MockMiscService
