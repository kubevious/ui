import _ from 'the-lodash';

import { IMarkerService } from '@kubevious/ui-middleware';
import {
    MarkerConfig,
    MarkerListItem,
    MarkerResult,
    MarkersExportData,
    MarkersImportData,
    MarkerStatus,
} from '@kubevious/ui-middleware/dist/services/marker';

import { BaseService } from './BaseService';

export class MarkerService extends BaseService implements IMarkerService {
    getList(): Promise<MarkerListItem[]> {
        return this.client
            .get<MarkerListItem[]>('/markers')
            .then((result) => result.data);
    }

    getItem(name: string): Promise<MarkerConfig | null> {
        return this.client
            .get<MarkerConfig | null>(`/marker/${name}`)
            .then((result) => result.data);
    }

    createItem(config: MarkerConfig, name: string): Promise<MarkerConfig> {
        return this.client
            .post<MarkerConfig>(`/marker/${name}`, {}, config)
            .then((result) => result.data);
    }

    deleteItem(name: string): Promise<void> {
        return this.client.delete(`/marker/${name}`).then(() => {});
    }

    exportItems(): Promise<MarkersExportData> {
        return this.client
            .get<MarkersExportData>('/markers/export')
            .then((result) => result.data);
    }

    importItems(data: MarkersImportData): Promise<void> {
        return this.client
            .post<void>('/markers/import', {}, data)
            .then((result) => {});
    }

    getItemStatuses(): Promise<MarkerStatus[]> {
        return this.client
            .get<MarkerStatus[]>('/markers-statuses')
            .then((result) => result.data);
    }

    getItemResult(name: string): Promise<MarkerResult> {
        return this.client
            .get<MarkerResult>(`/marker-result/${name}`)
            .then((result) => result.data);
    }

    subscribeItemStatuses(cb: (items: MarkerStatus[]) => void) {
        cb([]);

        this._socketSubscribe({ kind: 'markers-statuses' }, (value) => {
            if (!value) {
                value = [];
            }
            cb(value);
        });
    }

    subscribeItemResult(cb: (result: MarkerResult) => void) {
        const socketScope = this._socketScope((value, target) => {
            cb(value);
        });

        return {
            update: (markerName: string) => {
                socketScope.replace([
                    {
                        kind: 'marker-result',
                        name: markerName,
                    },
                ]);
            },
            close: () => {
                socketScope.close();
            },
        };
    }
}
