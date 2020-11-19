import _ from 'the-lodash'
import moment from 'moment'
import {
    ALERTS_DATA,
    GRAPH_DATA, HISTORY_GRAPH_DATA, HISTORY_ALERTS, HISTORY_PROPERTIES,
    HISTORY_RANGE,
    PROPERTIES_DATA,
    DN_LIST
} from '../boot/diagramMockData'
import { generateTimelineData } from '../boot/timelineBoot' 

class MockDiagramService {
    constructor(sharedState) {
        this.dateInit = moment();
        this.timelineData = generateTimelineData();
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

        this._latestTimelinePreviewData = [];
        this._timelinePreviewHandlers = [];

        this._intervals = [];

        this._intervals.push(setInterval(() => {
            this._performTimelinePreviewQuery();
        }, 10 * 1000))

        this._performTimelinePreviewQuery();
    }

    close()
    {
        for(let i of this._intervals) {
            clearInterval(i);
        }
        this._intervals = [];
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
        if (!criteria) {
            cb([]);
            return;
        }
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
        console.log("[fetchHistoryTimeline] BEGIN. PointCount: " + this.timelineData.length)
        console.log("[fetchHistoryTimeline] FROM: " + from)
        console.log("[fetchHistoryTimeline] TO: " + to)
        // cb([]);
        // return;

        console.time("PERF::fetchHistoryTimeline")

        const filteredData = [];
        const fromMoment = moment(from);
        const toMoment = moment(to);
        for(let x of this.timelineData)
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

    subscribeTimelinePreview(cb) {
        this._timelinePreviewHandlers.push(cb);
        cb(this._latestTimelinePreviewData);
    }

    _performTimelinePreviewQuery()
    {
        this.fetchHistoryTimelinePreview(data => {
            this._latestTimelinePreviewData = data;
            for(let cb of this._timelinePreviewHandlers)
            {
                cb(data);
            }
        });
    }

    fetchHistoryTimelinePreview(cb) {
        const now = moment();
        let diffSec = moment.duration(now.diff(this.dateInit)).asSeconds();
        diffSec = diffSec * 20 * 60;
        const adjustedNow = moment(this.dateInit).add(diffSec, 'seconds');

        const filteredData = [];
        for(let x of this.timelineData)
        {
            if (x.dateMoment.isSameOrBefore(adjustedNow))
            {
                filteredData.push(x);
            }
        }

        const resampledData = this._resampleTimelineData(filteredData);
        this._latestTimelinePreviewData = resampledData;

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
        if (!date) {
            throw new Error("MISSING DATE");
        }
        cb(HISTORY_GRAPH_DATA)
    }

    fetchHistoryProps(dn, date, cb) {
        if (!date) {
            throw new Error("MISSING DATE");
        }
        cb(_.cloneDeep(HISTORY_PROPERTIES))
    }

    fetchHistoryAlerts(dn, date, cb) {
        if (!date) {
            throw new Error("MISSING DATE");
        }
        cb(_.cloneDeep(HISTORY_ALERTS))
    }
}

export default MockDiagramService;
