import _ from 'the-lodash'

import { COLORS, SHAPES } from '../boot/markerData'

import { RemoteTrack } from '@kubevious/ui-framework/dist/remote-track'
import { ISharedState } from '@kubevious/ui-framework'

import { getRandomDnList } from './utils';
import { MockRootApiService } from './MockRootApiService';

import { IMarkerService } from '@kubevious/ui-middleware'

const MOCK_MARKERS_ARRAY : any[] = []

for (var i = 0; i < 30; i++) {
    MOCK_MARKERS_ARRAY.push({
        name: 'marker-' + (i + 1).toString(),
        shape: SHAPES[i % SHAPES.length],
        color: COLORS[i % COLORS.length],
        items: [],
        logs: [],
        is_current: (Math.random() * 10 % 2 === 0),
    })
}

export let MOCK_MARKERS = _.makeDict(MOCK_MARKERS_ARRAY, x => x.name);

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

            for (var marker of _.values(MOCK_MARKERS)) {
                var dnList = getRandomDnList();
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

    close()
    {
        
    }

    private _notifyMarkers() {
        const operation = this._remoteTrack.start(`notifyMarkers`)

        this.backendFetchMarkerList((result) => {
            this.sharedState.set('marker_editor_items', result);
        })

        var name = this.sharedState.get('marker_editor_selected_marker_id');
        if (name) {
            this._notifyMarkerStatus(name);
        }

        setTimeout(() => {
            operation.complete()
        }, 1000)
    }

    private _notifyMarkerStatus(name) {
        var marker = MOCK_MARKERS[name];
        var data : any = null;
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
        var item = this._makeMarkerListItem(x);
        if (!item) {
            return null;
        }
        return item;
    }

    backendFetchMarkerList(cb: (data: any) => any) : void {
        var list = _.values(MOCK_MARKERS);
        list = list.map(x => this._makeMarkerListItem(x));
        setTimeout(() => {
            cb(list);
        }, 100);
    }

    backendFetchMarker(name: string, cb: (data: any) => any) : void {
        var item = MOCK_MARKERS[name];
        item = this._makeMarkerItem(item);
        setTimeout(() => {
            cb(item);
        }, 500);
    }

    backendCreateMarker(marker: any, name: string, cb: (data: any) => any) : void {
        marker = _.clone({ ...marker, items: [], logs: [] });

        if (MOCK_MARKERS[name]) {
            this._backendUpdateMarker(marker, name, cb)
            return
        }

        MOCK_MARKERS[marker.name] = marker

        cb(marker);
        this._notifyMarkers();
    }

    private _backendUpdateMarker(marker, name, cb) {
        MOCK_MARKERS[marker.name] = _.clone({ ...marker });

        delete MOCK_MARKERS[name]

        cb(marker)
        this._notifyMarkers();
    }

    backendDeleteMarker(name: string, cb: (data: any) => any) : void{
        delete MOCK_MARKERS[name];
        cb({});
        this._notifyMarkers();
    }

    backendExportItems(cb: (data: any) => any) : void {
        var data = _.cloneDeep(_.values(MOCK_MARKERS));
        data = data.map(x => ({
            name: x.name,
            shape: x.shape,
            color: x.color,
        }));

        const response = {
            kind: 'markers',
            items: data,
        }
        cb(response);
    }

    backendImportItems(markers: any, cb: (data: any) => any) : void {
        if (markers.deleteExtra) {
            MOCK_MARKERS = {};
        }

        for (var x of markers.data.items) {
            x.items = []
            x.logs = []
            MOCK_MARKERS[x.name] = x;
        }

        cb({});
        this._notifyMarkers();
    }
}
