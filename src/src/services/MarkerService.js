
class MockMarkerService {
    constructor(client)
    {
        this._client = client;
    }

    backendFetchMarkerList(cb) {
        return this._client.get('/marker')
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

    backendCreateMarker(marker, cb) {
        return this._client.post('/marker', marker)
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

    backendUpdateMarker(id, config, cb) {
        return this._client.put('/marker/' + id, config)
            .then(result => {
                cb(result.data);
            });
    }

    backendExportItems(cb) {
        return this._client.get('/marker/export')
            .then(result => {
                cb(result.data);
            });
    }

    backendImportMarkers(markers, cb) {
        return this._client.post('/marker/import', markers)
            .then(result => {
                cb(result.data);
            });
    }
}

export default MockMarkerService