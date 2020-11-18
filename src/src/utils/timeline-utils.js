import moment from 'moment'

class TimelineUtils {
    constructor(sharedState) {
        this._sharedState = sharedState
        this.dayInSec =  12 * 60 * 60

    }

    getActualRange()
    {
        const time_machine_date_to = this._sharedState.get('time_machine_date_to');

        let to = moment();
        if (time_machine_date_to) {
            to = moment(time_machine_date_to);
        } else {
            const time_machine_timeline_preview_last_date =
                this._sharedState.get('time_machine_timeline_preview_last_date');
            if (time_machine_timeline_preview_last_date)
            {
                to = time_machine_timeline_preview_last_date.clone();
            }
        }

        const durationInSharedState = this._sharedState.get('time_machine_duration')
        const durationSec =
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

    getActualInitDuration() {
        let initDuration
        this._sharedState.subscribe(
            'time_machine_timeline_preview',
            (time_machine_timeline_preview) => {
                const lastDate = this._sharedState.get('time_machine_timeline_preview_last_date')
                const firstDate = time_machine_timeline_preview[0].dateMoment
                const previewDuration = lastDate.diff(firstDate, 'seconds')
                initDuration = Math.min(previewDuration, this.dayInSec)
            }
        )
        return initDuration
    }

}

export default TimelineUtils
