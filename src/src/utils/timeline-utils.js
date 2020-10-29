import moment from 'moment'

class TimelineUtils {
    constructor(sharedState) {
        this._sharedState = sharedState
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
        const durationSec = durationInSharedState > 0 ? durationInSharedState : 12 * 60 * 60

        let from = to.clone().subtract(durationSec, 'seconds');

        return {
            to,
            from
        };
    }
    
}

export default TimelineUtils
