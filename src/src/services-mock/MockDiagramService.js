import _ from 'the-lodash'
import moment from 'moment'
import {
    ALERTS_DATA,
    GRAPH_DATA, HISTORY_GRAPH_DATA, HISTORY_ALERTS, HISTORY_PROPERTIES,
    HISTORY_RANGE,
    PROPERTIES_DATA,
    DN_LIST
} from '../boot/diagramMockData'
import { timelineData } from '../boot/timelineBoot' 

class MockDiagramService {
    constructor(sharedState) {
        this.sharedState = sharedState;

        this.sharedState.set('time_machine_timeline_data', [])

        this.sharedState.subscribe(['selected_dn', 'time_machine_enabled'],
            ({ selected_dn, time_machine_enabled }) => {
                
                if (selected_dn) {
                    if (!time_machine_enabled) {
                        this.fetchProperties(selected_dn, (data) => {
                            this.sharedState.set('selected_object_props', data);
                        })

                        this.fetchAlerts(selected_dn, (data) => {
                            this.sharedState.set('selected_raw_alerts', data);
                        })
                    }
                }
            });
    }

    close()
    {
        
    }

    fetchDiagram(cb) {
        cb(GRAPH_DATA)
    }

    fetchProperties(dn, cb) {
        setTimeout(() => {
            cb(_.cloneDeep(PROPERTIES_DATA))
        }, 200);
    }

    fetchAlerts(dn, cb) {
        setTimeout(() => {
            cb(_.cloneDeep(ALERTS_DATA))
        }, 200);
    }

    getRandomDnList()
    {
        const count = this._randomInt(10) + 3;
        var res = [];

        for(var i = 0; i < count; i++)
        {
            var dn = DN_LIST[this._randomInt(DN_LIST.length)];
            res.push(dn)
        }
        return res;
    }

    fetchSearchResults(criteria, cb) {
        var res = this.getRandomDnList();
        res = res.map(x => ({
            dn: x
        }));
        cb(res);
    }

    _randomInt(x)
    {
        return Math.floor(Math.random() * x); 
    }

    fetchHistoryRange(cb) {
        cb(HISTORY_RANGE)
    }

    fetchHistoryTimeline(from, to, cb) {
        console.log("[fetchHistoryTimeline] BEGIN. PointCount: " + timelineData.length)
        console.log("[fetchHistoryTimeline] FROM: " + from)
        console.log("[fetchHistoryTimeline] TO: " + to)
        // cb([]);
        // return;

        console.time("PERF::fetchHistoryTimeline")

        const filteredData = [];
        const fromMoment = moment(from);
        const toMoment = moment(to);
        for(let x of timelineData)
        {
            if (x.dateMoment.isBetween(fromMoment, toMoment))
            {
                filteredData.push(x);
            }
        }
        console.timeEnd("PERF::fetchHistoryTimeline")
        console.log("[fetchHistoryTimeline] END. Filtered PointCount: " + filteredData.length);

        const resampledData = this._resampleTimelineData(filteredData);
        console.log("[fetchHistoryTimeline] END. Resampled PointCount: " + resampledData.length);

        setTimeout(() => {
            cb(resampledData);
        }, 500)
    }

    fetchHistoryTimelinePreview(cb) {
        const now = moment();
        const filteredData = [];
        for(let x of timelineData)
        {
            if (x.dateMoment.isSameOrBefore(now))
            {
                filteredData.push(x);
            }
        }

        const resampledData = this._resampleTimelineData(filteredData);

        setTimeout(() => {
            cb(resampledData);
        }, 500)
    }

    _resampleTimelineData(data)
    {
        if (data.length <= 200) {
            return data;
        }
        const index_delta = (data.length - 2) / (200 - 2);

        let resampled = [];
        resampled.push(data[0]);
        let latest_index = 0;
        for(let i = 0; i < 200 - 2; i++)
        {
            let index = Math.floor(i * index_delta);
            if (index != latest_index) {
                resampled.push(data[index]);
                latest_index = index;
            }
        }
        resampled.push(data[data.length - 1]);
        return resampled;
    }

    fetchHistorySnapshot(date, cb) {
        cb(HISTORY_GRAPH_DATA)
    }

    fetchHistoryProps(dn, date, cb) {
        cb(_.cloneDeep(HISTORY_PROPERTIES))
    }

    fetchHistoryAlerts(dn, date, cb) {
        cb(_.cloneDeep(HISTORY_ALERTS))
    }
}

export default MockDiagramService;
