import _ from 'the-lodash'
import { Promise } from 'the-promise'

import { COLORS, SHAPES } from '../boot/markerData'

import { RemoteTrack } from '@kubevious/ui-framework/dist/remote-track'
import { ISharedState } from '@kubevious/ui-framework'

import { getRandomDnList } from './utils';
import { MockRootApiService } from './MockRootApiService';

import { IMarkerService } from '@kubevious/ui-middleware'
import { MarkerConfig, MarkerListItem, MarkerResult, MarkersExportData, MarkersImportData, MarkerStatus } from '@kubevious/ui-middleware/dist/services/marker';

const MOCK_MARKERS_ARRAY : any[] = []

for (let i = 0; i < 30; i++) {
    MOCK_MARKERS_ARRAY.push({
        name: 'marker-' + (i + 1).toString(),
        shape: SHAPES[i % SHAPES.length],
        color: COLORS[i % COLORS.length],
        items: [],
        logs: [],
        is_current: (Math.random() * 10 % 2 === 0),
    })
}

export let MOCK_MARKERS = _.makeDict(MOCK_MARKERS_ARRAY, x => x.name, x => x);

export class MockMarkerService implements IMarkerService {

    private parent: MockRootApiService;
    private sharedState : ISharedState;
    private _remoteTrack : RemoteTrack;

    constructor(parent: MockRootApiService, sharedState: ISharedState)
    {
        this.parent = parent;
        this.sharedState = sharedState;
        this._remoteTrack = new RemoteTrack(sharedState)
        
        this._notifyMarkers();

        setInterval(() => {

            for (const marker of _.values(MOCK_MARKERS)) {
                const dnList = getRandomDnList();
                marker.items = dnList.map(x => ({
                    dn: x,
                }));
            }

            this._notifyMarkers();

        }, 5000);

        this.sharedState.subscribe('marker_editor_selected_marker_id',
            (marker_editor_selected_marker_id) => {
                this._notifyMarkerStatus(marker_editor_selected_marker_id);
            })
    }
    getMarkerStatuses(): Promise<MarkerStatus[]> {
        throw new Error('Method not implemented.')
    }
    getMarkerResult(name: string): Promise<MarkerResult> {
        throw new Error('Method not implemented.')
    }

    close()
    {
        
    }

    subscribeMarkerStatuses(cb: ((items: MarkerStatus[]) => void))
    {
        // TODO: FIX THIS
        this.getMarkerList()
            .then((result) => {
                cb(result as MarkerStatus[]);
            })
    }

    subscribeMarkerResult(cb: ((result: MarkerResult) => void))
    {
        return {
            update: (markerName : string) => {
                // if (markerName) 
                // {

                // }
                // socketScope.replace([
                //     { 
                //         kind: 'marker-result',
                //         name: markerName
                //     }
                // ]);
            },
            close: () => {
                // socketScope.close();
            }
        }
    }

    private _notifyMarkers() {
        // const id = new Date().toISOString();
        // this._remoteTrack.start({
        //     id: id,
        //     method: 'GET',
        //     url: '/',
        //     headers: {}
        // })

        // this.backendFetchMarkerList((result) => {
        //     this.sharedState.set('marker_editor_items', result);
        // })

        // const name = this.sharedState.get('marker_editor_selected_marker_id');
        // if (name) {
        //     this._notifyMarkerStatus(name);
        // }

        // setTimeout(() => {
        //     this._remoteTrack.finish({
        //         id: id,
        //         method: 'GET',
        //         url: '/',
        //         headers: {}
        //     }, {});
        // }, 1000)
    }

    private _notifyMarkerStatus(name) {
        const marker = MOCK_MARKERS[name];
        let data : any = null;
        if (marker) {
            data = {
                name: marker.name,
                is_current: marker.is_current,
                error_count: marker.logs.length,
            }
            data.items = marker.items;
            data.logs = marker.logs;
        }
        this.sharedState.set('rule_editor_selected_marker_status', data);
    }

    private _makeMarkerListItem(x) {
        if (!x) {
            return null;
        }
        return {
            name: x.name,
            shape: x.shape,
            color: x.color,
            item_count: x.items.length,
            error_count: x.logs.length,
            is_current: x.is_current,
        }
    }

    private _makeMarkerItem(x) {
        const item = this._makeMarkerListItem(x);
        if (!item) {
            return null;
        }
        return item;
    }

    getMarkerList() : Promise<MarkerListItem[]> {
        let list = _.values(MOCK_MARKERS);
        list = list.map(x => this._makeMarkerListItem(x));
        return Promise.timeout(100)
            .then(() => list);
    }

    getMarker(name: string) : Promise<MarkerConfig | null> {
        let item = MOCK_MARKERS[name];
        item = this._makeMarkerItem(item);
        return Promise.timeout(500)
            .then(() => item);
    }

    createMarker(config: MarkerConfig, name: string) : Promise<MarkerConfig> {
        let marker = _.clone({ ...config, items: [], logs: [] });

        if (name != config.name) {
            delete MOCK_MARKERS[name];
        }

        MOCK_MARKERS[marker.name] = marker

        this._notifyMarkers();

        return Promise.resolve(config);
    }

    deleteMarker(name: string) : Promise<void> {
        delete MOCK_MARKERS[name];
        this._notifyMarkers();
        return Promise.resolve();
    }

    exportMarkers() : Promise<MarkersExportData> {
        let data = _.cloneDeep(_.values(MOCK_MARKERS));
        data = data.map(x => ({
            name: x.name,
            shape: x.shape,
            color: x.color,
        }));

        const response : MarkersExportData = {
            kind: 'markers',
            items: data,
        }
        return Promise.resolve(response);
    }

    importMarkers(data: MarkersImportData) : Promise<void> {
        if (data.deleteExtra) {
            MOCK_MARKERS = {};
        }

        for (const x of data.data.items) {
            MOCK_MARKERS[x.name] = {
                name: x.name,
                shape: x.shape,
                color: x.color,
                items: [],
                logs: [],
                is_current: false
            };
        }

        this._notifyMarkers();
        return Promise.resolve();
    }
}
