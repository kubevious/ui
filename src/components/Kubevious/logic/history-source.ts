import _ from 'the-lodash' 
import moment from 'moment' 
import { ISharedState } from "@kubevious/ui-framework"
import { HistoryService } from "../../../services/HistoryService";
import { TimelineUtils } from "@kubevious/ui-time-machine"
import { HistoryTimelinePoint } from '@kubevious/ui-middleware/dist/services/history/types';

export class HistorySource {
    private _sharedState: ISharedState
    private _historyService: HistoryService;
    private _timelineUtils: TimelineUtils;

    private _desiredTimelineDateFrom!: moment.Moment;
    private _desiredTimelineDateTo!: moment.Moment;
    private _latestTimelineDateFrom!: moment.Moment;
    private _latestTimelineDateTo!: moment.Moment;
    private _isQueryingTimeline!: boolean;

    constructor(sharedState: ISharedState, historyService: HistoryService) {
        if (!sharedState) {
            throw new Error("SharedState not provided")
        }
        if (!historyService) {
            throw new Error("HistoryService not provided")
        }
        this._sharedState = sharedState.user();
        this._historyService = historyService;
        this._timelineUtils = new TimelineUtils(sharedState)

        
        this._setupTimeline();
        this._setupTimeMachine();

        this._sharedState.subscribe("latest_snapshot_id", () => {
            this._setupPreview();
        })

        // this._socketScope = socket.scope((value, target) => {
        //     this._sharedState.set('summary', value);
        // });
        // this._socketScope.replace([{ kind: WebSocketKind.props, dn: 'summary' }]);
    }

    close() {
        this._historyService.close();
        this._sharedState.close();

        this._sharedState.set('time_machine_timeline_preview', null);
        this._sharedState.set('time_machine_actual_date_to', null);
        this._sharedState.set('time_machine_actual_date_from', null);
        this._sharedState.set('time_machine_target_snapshot_id', null);
        this._sharedState.set('time_machine_target_date', null);
        this._sharedState.set('time_machine_actual_snapshot_id', null);
    }

    private _setupPreview()
    {
        this._historyService.fetchHistoryTimelinePreview()
            .then(result => {
                const massagedData = massageTimelineData(result);
                this._sharedState.set("time_machine_timeline_preview", massagedData);

                let lastDate : moment.Moment;
                if (massagedData.length > 0) {
                    lastDate = _.last(massagedData)!.dateMoment
                } else {
                    lastDate = moment();
                }
                this._sharedState.set(
                    "time_machine_timeline_preview_last_date",
                    lastDate
                )
            })
    }

    private _setupTimeline()
    {
        this._sharedState
            .subscribe(
                [
                    "time_machine_duration",
                    "time_machine_date_to",
                    "time_machine_timeline_preview_last_date",
                ],
                () => {
                    let actual = this._timelineUtils.getActualRange()

                    this._sharedState
                        .set("time_machine_actual_date_to", actual.to)
                    this._sharedState
                        .set("time_machine_actual_date_from", actual.from)
                }
            )

        this._sharedState
            .subscribe(
                [
                    "time_machine_actual_date_from",
                    "time_machine_actual_date_to",
                ],
                ({
                    time_machine_actual_date_from,
                    time_machine_actual_date_to,
                }) => {
                    this._desiredTimelineDateFrom = time_machine_actual_date_from
                    this._desiredTimelineDateTo = time_machine_actual_date_to

                    this._tryQueryTimelineData()
                }
            )
    }

    private _setupTimeMachine()
    {
        this._sharedState
            .subscribe(
                [
                    "time_machine_enabled",
                    "time_machine_target_date",
                    "time_machine_target_snapshot_id",
                ],
                ({
                    time_machine_enabled,
                    time_machine_target_date,
                    time_machine_target_snapshot_id,
                }) => {

                    if (time_machine_enabled)
                    {
                        if (time_machine_target_snapshot_id && time_machine_target_date)
                        {
                            this._sharedState.set("time_machine_actual_snapshot_id", time_machine_target_snapshot_id)
                            return;
                        }

                        if (time_machine_target_date)
                        {
                            const date = moment(time_machine_target_date);
                            this._historyService.fetchSnapshotAtDate(date.toDate())
                                .then(result => {
                                    if (time_machine_target_date !== this._sharedState.tryGet("time_machine_target_date")) {
                                        return;
                                    }
                                    if (result) {
                                        this._sharedState.set("time_machine_actual_snapshot_id", result.snapshot_id)
                                    } else {
                                        this._sharedState.set("time_machine_actual_snapshot_id", null)
                                    }
                                })
                            return;
                        }

                    } else {
                        this._sharedState.set("time_machine_target_snapshot_id", null)
                        this._sharedState.set("time_machine_actual_snapshot_id", null)
                    }
                }
            )
    }

    private _tryQueryTimelineData(): void {
        const from = this._desiredTimelineDateFrom
        const to = this._desiredTimelineDateTo

        if (from === this._latestTimelineDateFrom &&
            to === this._latestTimelineDateTo)
            {
            return
        }

        if (!from || !to) {
            return;
        }

        if (this._isQueryingTimeline) {
            return
        }
        this._isQueryingTimeline = true

        this._historyService.fetchHistoryTimeline(from.toDate(), to.toDate())
            .then((data) => {
                this._isQueryingTimeline = false

                this._latestTimelineDateFrom = from
                this._latestTimelineDateTo = to

                const massagedData = massageTimelineData(data)
                this._sharedState.set("time_machine_timeline_data", massagedData)

                this._tryQueryTimelineData()
            })
    }

}

function massageTimelineData(data: HistoryTimelinePoint[]): TimelinePoint[] {
    if (!data || data.length === 0) {
        let date = moment()
        return [
            {
                date: date.toISOString(),
                dateMoment: date,
                error: 0,
                warn: 0,
                changes: 0,
            }
        ]
    }

    return data.map(x => {
        let xx = x as TimelinePoint;
        xx.dateMoment = moment(x.date);
        return xx;
    })
}

interface TimelinePoint extends HistoryTimelinePoint {
    dateMoment: moment.Moment;
};