import { BaseHttpService } from '@kubevious/ui-framework'
import { HistoryHierarchyResult, HistoryNodeResult, HistorySnapshotInfo, HistoryTimelinePoint } from '@kubevious/ui-middleware/dist/services/history/types';

export class HistoryService extends BaseHttpService
{
    fetchHistoryTimelinePreview()
    {
        return this.client
            .get<HistoryTimelinePoint[]>(`/timeline_preview`)
            .then((result) => result.data)
    }

    fetchHistoryTimeline(from: Date, to: Date)
    {
        return this.client
            .get<HistoryTimelinePoint[]>(`/timeline`, 
                { 
                    from: from.toISOString(),
                    to: to.toISOString()
                })
            .then((result) => result.data)
    }

    fetchSnapshotAtDate(date: Date)
    {
        return this.client
            .get<HistorySnapshotInfo | null>
                (`/snapshot_at_date`, { date: date.toISOString() })
            .then((result) => result.data)
    }

    fetchNodeHistory(dn: string, token?: string)
    {
        const params : NodeHistoryQuery = {
            dn: dn,
            token: token ?? undefined
        };

        return this.client
            .get<HistoryNodeResult, NodeHistoryQuery>
                (`/node`, params)
            .then((result) => result.data)
    }

    fetchHierarchyHistory(dn: string, token?: string)
    {
        const params : NodeHistoryQuery = {
            dn: dn,
            token: token ?? undefined
        };

        return this.client
            .get<HistoryHierarchyResult, NodeHistoryQuery>
                (`/hierarchy`, params)
            .then((result) => result.data)
    }
}


interface NodeHistoryQuery
{
    dn: string,
    token?: string,
}