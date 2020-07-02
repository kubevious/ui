class MarkerService {
    constructor(client)
    {
        this._client = client;
    }

    backendFetchMarkerList(cb) {
        return this._client.get('/markers')
            .then(result => {
                cb(result.data);
            });
    }

    backendFetchMarker(id, cb) {
        return this._client.get('/marker/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendCreateMarker(config, targetName, cb) {
        return this._client.post('/marker/' + targetName, config)
            .then(result => {
                cb(result.data)
            });
    }

    backendDeleteMarker(id, cb) {
        return this._client.delete('/marker/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendExportItems(cb) {
        return this._client.get('/markers/export')
            .then(result => {
                cb(result.data);
            });
    }

    backendImportItems(markers, cb) {
        return this._client.post('/markers/import', markers)
            .then(result => {
                cb(result.data);
            });
    }
}

export default MarkerService
