import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import $ from 'jquery'
import _ from 'the-lodash'
import moment from 'moment'
import { formatDate } from '../../utils/ui-utils'
import c3 from 'c3'
import * as d3 from 'd3'

import './styles.scss'

class Timeline extends BaseComponent {
  constructor(props) {
    super(props)

    this._parentElem = null
    this._showAxis = false

    this.state = this._makeDefaultState();

    this._handleChartClick = this._handleChartClick.bind(this)
    this._calculateIndexes = this._calculateIndexes.bind(this)
    this._handleBrush = this._handleBrush.bind(this)
  }

  _makeDefaultState()
  {
    return {
      isTimeMachineActive: false,
      targetDate: null,
      chartData: [],
      chartPreviewData: [],
      dateTo: null,
      actualDateTo: null,
      dateFrom: null,
      actualDateFrom: null,
      duration: 12 * 60 * 60,
      selectionDateFromIndex: 0,
      selectionDateToIndex: 0
    };
  }

  _reset()
  {
    this.sharedState.set('time_machine_enabled', false)
    this.sharedState.set('time_machine_date_to', null)
    this.sharedState.set('time_machine_duration', 12 * 60 * 60)
    this.sharedState.set('time_machine_target_date', null);
    this.sharedState.set('time_machine_date', null);
    this._renderChart().zoom(this._resetZoom())
  }

  _resetZoom() {
    const data = this.state.chartPreviewData
    const dateFrom = moment().subtract(12 * 60 * 60, 'seconds')
    const indexFrom = data.findIndex(elem => moment(elem.date).isSameOrAfter(dateFrom, 'minutes'))
    const indexTo = data.length - 1
    return [indexFrom, indexTo]
  }

  _toggleTimeMachine() {
    if (this.state.isTimeMachineActive)
    {
      this.sharedState.set('time_machine_enabled', false);
    }
    else
    {
      this.sharedState.set('time_machine_enabled', true);
      let date;
      if (this.state.targetDate)
      {
        date = moment(this.state.targetDate).toISOString();
      }
      else
      {
        date = this.state.actualDateTo.toISOString();
      }
      this.sharedState.set('time_machine_target_date', date)
      this.sharedState.set('time_machine_date', date)
    }
  }

  _formatXaxis(item) {
    return moment(item).format('MMM DD hh:mm A')
  }

  _calculateIndexes() {
    if (!this.state.actualDateFrom && !this.state.actualDateTo) {
      return
    }

    const data = this.state.chartPreviewData
    const indexFrom = data.findIndex(elem => { 
      return moment(elem.date).isSameOrAfter(this.state.actualDateFrom, 'minutes')
    })
    const indexTo = data.findIndex(elem => {
      return moment(elem.date).isSameOrAfter(this.state.actualDateTo, 'minutes')
    })
    return [indexFrom, indexTo]
  }

  _handleChartClick(d, element) {
    this.sharedState.set('time_machine_enabled', true)
    this.sharedState.set('time_machine_target_date', this.state.chartPreviewData[d.x].date)
  }

  _handleBrush(domain) {
    const brushDateTo = ~~domain[1]
    const brushDateFrom = ~~domain[0]
          console.log("[TIMELINE:_calculateIndexes] ", domain);
          console.log("[TIMELINE:_calculateIndexes] SIZE: " + this.state.chartPreviewData.length);
      
          if (brushDateTo == -1 || brushDateFrom == -1) {
            console.log("[TIMELINE:_calculateIndexes] IS -1!!!!", domain);
            return ;
          }
      
          let dateTo = null;
          let effectiveDateTo = null;
          if (brushDateTo >= this.state.chartPreviewData.length - 1)
          {
            dateTo = moment();
            effectiveDateTo = null;
          } else {
            dateTo = this.state.chartPreviewData[
              brushDateTo
            ].dateMoment;
            effectiveDateTo = dateTo.toISOString();
          }
      
          let dateFrom = this.state.chartPreviewData[
            brushDateFrom
          ].dateMoment;
      
          let diff = moment.duration(dateTo.diff(dateFrom));
          let durationSeconds = diff.asSeconds();
      
          this.sharedState.set('time_machine_date_to', effectiveDateTo)
    this.sharedState.set('time_machine_duration', durationSeconds)

    
  }

  _renderChart() {
    const data = this.sharedState.get('time_machine_timeline_preview')
    const chart = c3.generate({
      padding: {
        left: 20,
        right: 20,
      },
      data: {
        json: data,
        keys: {
          x: 'date',
          value: ['error', 'warn', 'changes'],
        },
        types: {
          changes: 'line',
          error: 'area',
          warn: 'area',
        },
        groups: [['error', 'warn'], ['changes']],
        colors: {
          changes: 'white',
          error: '#9b6565',
          warn: '#fcbd3f',
        },
        selection: {
          enabled: true,
          multiple: false
        },
        onclick: this._handleChartClick
      },
      axis: {
        y: {
          show: false,
        },
        x: {
          type: 'category',
          tick: {
            format: function (x) {
              return data[Math.ceil(x)].dateMoment.format('MMM DD hh:mm A')
            },
            count: 5,
            outer: true,
            multiline: false,
          },
        },
      },
      subchart: {
        show: true,
        onbrush: this._handleBrush,
        size: {
          height: 40
        }
      },
      zoom: {
        enabled: true,
        onzoom: this._handleBrush,
        initialRange: this._calculateIndexes()
      },
      point: {
        show: false,
        select: {
          r: 5
        }
      },
    })
    return chart
  }

  componentDidMount() {
    this._renderChart()

    this.subscribeToSharedState(
      [
        'time_machine_enabled',
        'time_machine_target_date',
        'time_machine_timeline_data',
        'time_machine_timeline_preview',
        'time_machine_date_to',
        'time_machine_duration'
      ],
      ({
        time_machine_enabled,
        time_machine_target_date,
        time_machine_timeline_data,
        time_machine_timeline_preview,
        time_machine_date_to,
        time_machine_duration
      }) => {

        console.log("[TIMLINE] TARGET DATE: ", moment(time_machine_target_date).toISOString());
        console.log("[TIMLINE] INPUT DURATION: ", time_machine_duration);
        console.log("[TIMLINE] INPUT TO: ", time_machine_date_to);

        let newState = this._makeDefaultState();

        if (time_machine_enabled && time_machine_target_date)
        {
          newState.isTimeMachineActive = true;
        }
        newState.targetDate = time_machine_target_date;

        if (time_machine_timeline_data) {
          newState.chartData = time_machine_timeline_data
        }

        if (time_machine_timeline_preview) {
          newState.chartPreviewData = time_machine_timeline_preview;

          // TODO: Doing clone helps with RESET button showing correct range.
          // newState.chartPreviewData = _.clone(time_machine_timeline_preview);
        }

        if (time_machine_duration) {
          newState.duration = time_machine_duration;
        }
        if (time_machine_date_to) {
          newState.dateTo = moment(time_machine_date_to);
          newState.actualDateTo = newState.dateTo.clone();
        } else {
          newState.actualDateTo = moment();
        }

        newState.dateFrom = newState.actualDateTo.clone().subtract(newState.duration, 'seconds');
        newState.actualDateFrom = newState.dateFrom.clone();

      
        {
          let index = _.findIndex(newState.chartPreviewData, x => {
            return x.dateMoment.isSameOrAfter(newState.actualDateFrom);
          })
          newState.selectionDateFromIndex = Math.max(0, index);
        }

        {
          let index = _.findLastIndex(this.state.chartPreviewData, elem => {
            return elem.dateMoment.isSameOrBefore(newState.actualDateTo);
          })
          newState.selectionDateToIndex = Math.max(0, index);
        }

        console.log("[TIMLINE] FINAL DURATION: " + newState.duration);
        console.log("[TIMLINE] FINAL ACTUAL FROM: " + newState.actualDateFrom.toISOString());
        console.log("[TIMLINE] FINAL ACTUAL TO:   " + newState.actualDateTo.toISOString());
        console.log("[TIMLINE] FINAL selectionDateFromIndex: " + newState.selectionDateFromIndex);
        console.log("[TIMLINE] FINAL   selectionDateToIndex: " + newState.selectionDateToIndex);

        this.setState(newState);
      }
    )

  }

  render() {


    $(document).on('layout-resize-timelineComponent', () => { 
      this._renderChart()
    })
    return (
      <div id="timelineComponent" className="timeline size-to-parent">
        <div className="chart-view">
          <div id="chart"></div>
        </div>
        <div className="tl-actions">
          <a
            role="button"
            id="btnTimelineTimeMachine"
            className={`timemachine ${this.state.isTimeMachineActive && 'active'}`}
            onClick={() => this._toggleTimeMachine()}
          >
            <span className="tooltiptext">Activate Time Machine</span>
          </a>
          <a
            role="button"
            id="btnTimelineTimeMachine"
            className={`reset`}
            onClick={() => this._reset()}
          ><span className="tooltiptext">Reset changes</span>
          </a>
        </div>
      </div>
    )
  }
}

export default Timeline
