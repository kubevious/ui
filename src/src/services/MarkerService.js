import BackendClient from './BackendClient'

class MockMarkerService {

    backendFetchMarkerList(cb) {
        return BackendClient.get('/api/v1/marker')
            .then(result => {
                cb(result.data);
            });
    }

    backendFetchMarker(id, cb) {
        return BackendClient.get('/api/v1/marker/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendCreateMarker(marker, cb) {
        return BackendClient.post('/api/v1/marker', marker)
            .then(result => {
                cb(result.data)
            });
    }

    backendDeleteMarker(id, cb) {
        return BackendClient.delete('/api/v1/marker/' + id)
            .then(result => {
                cb(result.data);
            });
    }

    backendUpdateMarker(id, config, cb) {
        return BackendClient.put('/api/v1/marker/' + id, config)
            .then(result => {
                cb(result.data);
            });
    }

    backendExportItems(cb) {
        return BackendClient.get('/api/v1/marker/export')
            .then(result => {
                cb(result.data);
            });
    }

    backendImportMarkers(markers, cb) {
        return BackendClient.post('/api/v1/marker/import', markers)
            .then(result => {
                cb(result.data);
            });
    }
}

export default MockMarkerService