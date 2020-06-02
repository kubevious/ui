import _ from 'the-lodash'

import { COLORS, SHAPES } from '../boot/markerData'

var MOCK_MARKERS = []

for(var i = 0; i < 30; i++) {
    MOCK_MARKERS.push({
        id: i + 1,
        name: 'marker-' + (i+1).toString(),
        shape: {
            name: SHAPES[i % SHAPES.length].name,
            unicode: SHAPES[i % SHAPES.length].unicode,
        },
        color: COLORS[i % COLORS.length],
    })
};

MOCK_MARKERS = _.makeDict(MOCK_MARKERS, x => x.id);

class MockMarkerService {

    constructor(parent, sharedState) {
        this._parent = parent;
        this.sharedState = sharedState;
        this._notifyMarkers();

        setInterval(() => {

            for (var marker of _.values(MOCK_MARKERS)) {
                var dnList = this._parent.getRandomDnList();
                marker.items = dnList.map(x => ({
                    dn: x
                }));
            }

            this._notifyMarkers();

        }, 5000);

        this.sharedState.subscribe('marker_editor_selected_marker_id',
            (marker_editor_selected_marker_id) => {
                this._notifyMarkerStatus(marker_editor_selected_marker_id);
            })
    }

    _notifyMarkers() {
        this.backendFetchMarkerList((result) => {
            this.sharedState.set('marker_editor_items', result);
        })

        var id = this.sharedState.get('marker_editor_selected_marker_id');
        if (id) {
            this._notifyMarkerStatus(id);
        }
    }

    _notifyMarkerStatus(id) {
        var marker = MOCK_MARKERS[id];
        var data = null;
        if (marker) {
            var count = 0;
            if (marker.items) {
                count = marker.items.length;
            }
            data = {
                id: id,
                status: {
                    item_count: count
                }
            }
            data.items = marker.items;
        }
        this.sharedState.set('marker_editor_selected_marker_status', data);
    }

    _makeMarkerListItem(x) {
        if (!x) {
            return null;
        }
        return {
            id: x.id,
            name: x.name,
            shape: x.shape,
            color: x.color
        }
    }

    _makeMarkerItem(x) {
        var item = this._makeMarkerListItem(x);
        if (!item) {
            return null;
        }
        return item;
    }

    backendFetchMarkerList(cb) {
        var list = _.values(MOCK_MARKERS);
        list = list.map(x => this._makeMarkerListItem(x));
        setTimeout(() => {
            cb(list);
        }, 100);
    }

    backendFetchMarker(id, cb) {
        var item = MOCK_MARKERS[id];
        item = this._makeMarkerItem(item);
        setTimeout(() => {
            cb(item);
        }, 500);
    }

    backendCreateMarker(marker, cb) {
        marker = _.clone({ ...marker });
        marker.id = this._newID();
        MOCK_MARKERS[marker.id] = marker;
        cb(marker);
        this._notifyMarkers();
    }

    backendDeleteMarker(id, cb) {
        delete MOCK_MARKERS[id];
        cb();
        this._notifyMarkers();
    }

    backendUpdateMarker(id, config, cb) {
        var marker = MOCK_MARKERS[id];
        if (marker) {
            marker.name = config.name
            marker.shape = config.shape
            marker.color = config.color
        }
        cb(marker);
        this._notifyMarkers();
    }

    backendExportItems(cb) {
        var data = _.cloneDeep(_.values(MOCK_MARKERS));
        data = data.map(x => ({
            name: x.name,
            shape: x.shape,
            color: x.color
        }));
        cb(data);
    }

    backendImportMarkers(markers, cb) {
        if (markers.deleteExtra)
        {
            MOCK_MARKERS = {};
        }
        for (var marker of markers.data) {
            var newMarker = this._findByName(marker.name);
            if (!newMarker) {
                var id = this._newID();
                newMarker = {
                    id: id
                }
                MOCK_MARKERS[id] = newMarker;
            }
            newMarker.name = marker.name;
            newMarker.shape = marker.shape;
            newMarker.color = marker.color;
        }
        console.log(MOCK_MARKERS);
        cb();
        this._notifyMarkers();
    }

    _findByName(name)
    {
        return _.head(_.values(MOCK_MARKERS).filter(x => x.name === name));

    }

    _newID()
    {
        if (!_.values(MOCK_MARKERS).length) {
            return 1;
        }
        var id = _.max(_.values(MOCK_MARKERS).map(x => x.id)) + 1;
        return id;
    }
}

export default MockMarkerService