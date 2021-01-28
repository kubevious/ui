import moment, { Moment } from 'moment'

class TimelineUtils {
    private _sharedState: any
    private dayInSec: number
    constructor(sharedState: {}) {
        this._sharedState = sharedState
        this.dayInSec =  12 * 60 * 60

    }

    getActualRange(): {
        to: Moment;
        from: Moment;
    } {
        const time_machine_date_to: string = this._sharedState.get('time_machine_date_to');

        let to = moment();
        if (time_machine_date_to) {
            to = moment(time_machine_date_to);
        } else {
            const time_machine_timeline_preview_last_date: Moment =
                this._sharedState.get('time_machine_timeline_preview_last_date');
            if (time_machine_timeline_preview_last_date)
            {
                to = time_machine_timeline_preview_last_date.clone();
            }
        }

        const durationInSharedState: number = this._sharedState.get('time_machine_duration') || this.dayInSec
        const durationSec: number =
            this.getActualInitDuration() >= this.dayInSec ||
            this.getActualInitDuration() > durationInSharedState
                ? durationInSharedState
                : this.getActualInitDuration()

        let from = to.clone().subtract(durationSec, 'seconds');

        to = moment(to.toDate()) // Needed to swap moment internal _d and _i values
        from = moment(from.toDate())

        return {
            to,
            from
        };
    }

    getActualInitDuration(): number {
        let initDuration: number = this.dayInSec
        this._sharedState.subscribe(
            'time_machine_timeline_preview',
            (time_machine_timeline_preview: { dateMoment: Moment; }[]) => {
                const lastDate: Moment = this._sharedState.get('time_machine_timeline_preview_last_date')
                const firstDate: Moment = time_machine_timeline_preview[0].dateMoment
                const previewDuration: number = lastDate.diff(firstDate, 'seconds')
                initDuration = Math.min(previewDuration, this.dayInSec)
            }
        )
        return initDuration
    }

}

export default TimelineUtils
