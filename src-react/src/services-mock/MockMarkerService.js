import _ from 'the-lodash'

var MOCK_MARKERS = [
    {
        id: 1,
        name: 'marker-1',
        shape: 'triangle',
        color: '#330033'
    },
    {
        id: 2,
        name: 'marker-2',
        shape: 'plus',
        color: '#c79700'
    },
    {
        id: 3,
        name: 'marker-3',
        shape: 'check',
        color: '#00ccff'
    }
];
const MOCK_MARKER_EDITOR_ITEMS = [
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-gitlab-exporter]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-gitlab-shell]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-minio]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-registry]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-sidekiq-all-in-1]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-task-runner]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-unicorn]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-gitaly]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-redis-server]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[gitlab]/app-[gitlab-migrations.1]/initcont-[configure]/image-[busybox]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[sock-shop]/app-[carts-db]/cont-[carts-db]/image-[mongo]',
        'has_error': 1,
        'has_warning': 0
    },
    {
        'dn': 'root/ns-[sock-shop]/app-[orders-db]/cont-[orders-db]/image-[mongo]',
        'has_error': 1,
        'has_warning': 0
    }
];
MOCK_MARKERS = _.makeDict(MOCK_MARKERS, x => x.id);
for (var x of _.values(MOCK_MARKERS)) {
    x.items = [];
    x.logs = [];
    x.isCurrent = (x.id % 2 === 0);
}

class MockMarkerService {

    constructor(state) {
        this._state = state;
        this._notifyMarkers();

        setInterval(() => {
            for (var x of _.values(MOCK_MARKERS)) {
                x.isCurrent = true;
                x.items = [];
                x.logs = [];
            }

            for (var marker of _.values(MOCK_MARKERS)) {
                var count = Math.floor(Math.random() * _.values(MOCK_MARKER_EDITOR_ITEMS).length);
                marker.items = _.take(MOCK_MARKER_EDITOR_ITEMS, count);
            }

            this._notifyMarkers();

        }, 5000);

        this._state.subscribe('marker_editor_selected_marker_id',
            (marker_editor_selected_marker_id) => {
                this._notifyMarkerStatus(marker_editor_selected_marker_id);
            })
    }

    _notifyMarkers() {
        this.backendFetchMarkerList((result) => {
            this._state.set('marker_editor_items', result);
        })

        var id = this._state.get('marker_editor_selected_marker_id');
        if (id) {
            this._notifyMarkerStatus(id);
        }
    }

    _notifyMarkerStatus(id) {
        var marker = MOCK_MARKERS[id];
        var data = null;
        if (marker) {
            data = {
                id: id,
                status: {
                    isCurrent: marker.isCurrent,
                    error_count: marker.logs.length,
                    item_count: marker.items.length
                }
            }
            data.items = marker.items;
            data.logs = marker.logs;
        }
        this._state.set('marker_editor_selected_marker_status', data);
    }

    _makeMarkerListItem(x) {
        if (!x) {
            return null;
        }
        return {
            id: x.id,
            name: x.name,
            shape: x.shape,
            color: x.color,
            item_count: x.items.length,
            error_count: x.logs.length,
            isCurrent: x.isCurrent
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
        marker = _.clone({ ...marker, items: [], logs: [] });
        marker.id = _.max(_.values(MOCK_MARKERS).map(x => x.id)) + 1;
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
        for (var x of data) {
            delete x.id;
        }
        cb(data);
    }

    backendImportMarkers(markers, cb) {
        MOCK_MARKERS = {};
        for (var x of markers) {
            x.id = _.max(_.values(MOCK_MARKERS).map(x => x.id)) + 1;
            x.items = []
            x.logs = []
            MOCK_MARKERS[x.id] = x;
        }
        cb();
        this._notifyMarkers();
    }
}

export default MockMarkerService