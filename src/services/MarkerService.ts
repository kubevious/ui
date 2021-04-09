import _ from 'the-lodash';

import { IMarkerService } from '@kubevious/ui-middleware';
import { MarkerResult, MarkerStatus } from '@kubevious/ui-middleware/dist/services/marker';

import { BaseService } from './BaseService'

export class MarkerService extends BaseService implements IMarkerService {

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
        this.client.post('/marker/' + targetName, {}, config)
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
        this.client.post('/markers/import', {}, markers)
            .then(result => {
                cb(result.data); // any
                return null;
            });
    }

    subscribeMarkerStatuses(cb: ((items: MarkerStatus[]) => void))
    {
        cb([]);

        this._socketSubscribe({ kind: 'markers-statuses' }, value => {
            if (!value) {
                value = [];
            }
            cb(value);
        });
    }

    subscribeMarkerResult(cb: ((result: MarkerResult) => void))
    {
        const socketScope = this._socketScope((value, target) => {
            cb(value);
        });

        return {
            update: (markerName : string) => {
                socketScope.replace([
                    { 
                        kind: 'marker-result',
                        name: markerName
                    }
                ]);
            },
            close: () => {
                socketScope.close();
            }
        }
    }

}
