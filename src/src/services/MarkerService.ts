import _ from 'the-lodash';
import { BaseService } from './BaseService'

import { HttpClient, ISharedState } from '@kubevious/ui-framework';

import { IMarkerService, IWebSocketService } from '@kubevious/ui-middleware';

export class MarkerService extends BaseService implements IMarkerService {

    constructor(client: HttpClient, sharedState: ISharedState, socket: IWebSocketService)
    {
        super(client, sharedState, socket)

        this._setupWebSocket();
    }

    backendFetchMarkerList(cb: (data: any) => any) : void {
        this.client.get('/markers')
            .then(result => {
                cb(result.data); //EditorItem[]
                return null;
            });
    }

    backendFetchMarker(id: string, cb: (data: any) => any) : void {
        this.client.get('/marker/' + id)
            .then((result) => {
                cb(result.data); //EditorItem | null
                return null;
            });
    }

    backendCreateMarker(config: any, targetName: string, cb: (data: any) => any) : void {
        this.client.post('/marker/' + targetName, config)
            .then(result => {
                cb(result.data) //any
                return null;
            });
    }

    backendDeleteMarker(id: string, cb: (data: any) => any) : void {
        this.client.delete('/marker/' + id)
            .then(result => {
                cb(result.data); //any
                return null;
            });
    }

    backendExportItems(cb: (data: any) => any) : void {
        this.client.get('/markers/export')
            .then(result => {
                cb(result.data); //{ kind: string; items: DataItem[]; }
            });
    }

    backendImportItems(markers: any, cb: (data: any) => any) : void {
        this.client.post('/markers/import', markers)
            .then(result => {
                cb(result.data); // any
                return null;
            });
    }

    private _setupWebSocket()
    {
        this.sharedState.set('marker_editor_items', []);

        this._socketSubscribe({ kind: 'markers-statuses' }, value => {
            if (!value) {
                value = [];
            }
            this.sharedState.set('marker_editor_items', value)
        });

        const selectedMarkerScope = this._socketScope((value, target) => {

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
