import { Promise } from 'the-promise'

import { app, BaseHttpService, HttpClient } from '@kubevious/ui-framework'

import { IMarkerService, IWebSocketService } from '@kubevious/ui-middleware'
import { MarkerConfig, MarkerListItem, MarkerResult, MarkerResultSubscriber, MarkersExportData, MarkersImportData, MarkerStatus } from '@kubevious/ui-middleware/dist/services/marker';
import { WebSocketKind } from './types';

export class MarkerService extends BaseHttpService implements IMarkerService
{
    private _ws : IWebSocketService;

    constructor(client: HttpClient)
    {
        super(client);

        this._ws = app.serviceRegistry.resolveService({ kind: 'socket' });
    }

    close()
    {
        super.close();
        this._ws.close();
    }

    getList(): Promise<MarkerListItem[]>
    {
        return this.client
            .get<MarkerListItem[]>("/markers")
            .then((result) => result.data);
    }

    getItem(name: string): Promise<MarkerConfig | null>
    {
        return this.client
            .get<MarkerConfig | null>("/marker", { marker: name })
            .then((result) => result.data);
    }

    createItem(config: MarkerConfig, name: string): Promise<MarkerConfig>
    {
        return this.client
            .post<MarkerConfig>("/marker", { marker: name }, config)
            .then((result) => {
                return result.data;
            });
    }

    deleteItem(name: string): Promise<void>
    {
        return this.client
            .delete("/marker", { marker: name })
            .then((result) => {
                return result.data;
            });
    }

    exportItems(): Promise<MarkersExportData>
    {
        return this.client
            .get<MarkersExportData>("/export-markers")
            .then((result) => result.data);
    }

    importItems(data: MarkersImportData): Promise<void>
    {
        return this.client
            .post("/import-markers", { }, data)
            .then((result) => {
                return result.data
            });
    }

    getItemStatuses(): Promise<MarkerStatus[]>
    {
        return this.client
            .get<MarkerStatus[]>("/marker-statuses")
            .then((result) => result.data);
    }

    getItemResult(name: string): Promise<MarkerResult>
    {
        return this.client
            .get<MarkerResult>("/marker-result", { marker: name })
            .then((result) => result.data);
    }

    subscribeItemStatuses(cb: (items: MarkerStatus[]) => void): void
    {
        this._ws.subscribe({ kind: WebSocketKind.markers_statuses }, (value) => {
            cb(value);
        })
    }

    subscribeItemResult(cb: (result: MarkerResult) => void): MarkerResultSubscriber
    {
        const wsScope = this._ws.scope((value, target) => {
            cb(value);
        });

        return {
            update: (name: string | null) => {

                if (name) {
                    wsScope.replace([{   
                        kind: WebSocketKind.marker_result,
                        name: name
                    }])
                } else {
                    wsScope.replace([])
                }

            },
            close: () => {
                wsScope.close();
            }
        }
    }

}
