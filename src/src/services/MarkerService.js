import BaseService from './BaseService'

class MarkerService extends BaseService {
    constructor(client, sharedState, socket)
    {
        super(client, sharedState, socket)

        this._setupWebSocket();
    }

    backendFetchMarkerList(cb) {
        return this._client.get('/markers')
            .then(result => {
                cb(result.data); //Marker[]
            });
    }

    backendFetchMarker(id, cb) {
        return this._client.get('/marker/' + id)
            .then((result) => {
                cb(result.data); //Marker | null
            });
    }

    backendCreateMarker(config, targetName, cb) {
        return this._client.post('/marker/' + targetName, config)
            .then(result => {
                cb(result.data) //any
            });
    }

    backendDeleteMarker(id, cb) {
        return this._client.delete('/marker/' + id)
            .then(result => {
                cb(result.data); //any
            });
    }

    backendExportItems(cb) {
        return this._client.get('/markers/export')
            .then(result => {
                cb(result.data); //{ kind: string; items: DataItem[]; }
            });
    }

    backendImportItems(markers, cb) {
        return this._client.post('/markers/import', markers)
            .then(result => {
                cb(result.data); // any
            });
    }

    _setupWebSocket()
    {
        this.sharedState.set('marker_editor_items', []);

        this._socketSubscribe({ kind: 'markers-statuses' }, value => {
            if (!value) {
                value = [];
            }
            this.sharedState.set('marker_editor_items', value)
        });

        var selectedMarkerScope = this._socketScope((value, target) => {

            this.sharedState.set('rule_editor_selected_marker_status', value);

        });

        this.sharedState.subscribe('marker_editor_selected_marker_id',
            (marker_editor_selected_marker_id) => {

                if (marker_editor_selected_marker_id)
                {
                    selectedMarkerScope.replace([
                        { 
                            kind: 'marker-result',
                            name: marker_editor_selected_marker_id
                        }
                    ]);
                }

            });
    }
}

export default MarkerService
