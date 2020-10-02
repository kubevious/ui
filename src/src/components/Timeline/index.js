import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import $ from 'jquery'
import _ from 'the-lodash'
import moment from 'moment'
import { formatDate } from '../../utils/ui-utils'
import {
  Bar,
  Brush,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ComposedChart,
  ReferenceLine,
  Label,
  Legend,
  Line,
} from 'recharts'
import { debounce } from "debounce"

import './styles.scss'
// import { this.timelineData } from '../../boot/timelineBoot'

class Timeline extends BaseComponent {
  constructor(props) {
    super(props)

    this._parentElem = null
    this._showAxis = false

    this.state = this._makeDefaultState();

    this._handleChartClick = this._handleChartClick.bind(this)
    this._calculateIndexes = this._calculateIndexes.bind(this)
    // this._calculateStartIndex = this._calculateStartIndex.bind(this)
    // this._calculateEndIndex = this._calculateEndIndex.bind(this)
    this._customTooltip = this._customTooltip.bind(this)
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

  _customTooltip({ active, payload, label }) {
    if (active && payload && payload.length > 0) {
      return (
        <>
        <div className="custom-tooltip">
          {!this.state.isTimeMachineActive && <p className="activate-info">Click to activate the Time Machine</p>} 
          <p>Changes: {payload[0].payload.changes}</p>
          <p>Errors: {payload[0].payload.error}</p>
          <p>Warnings: {payload[0].payload.warn}</p>
          </div>
          </>
      )
    }
  }

  _renderHoverTimeStamp({ payload, cx }) {
    return (
      <>
        <rect
          style={{ transform: `translate(${cx - 55}px, calc(100% - 25px))` }}
        />
        <text
          style={{ transform: `translate(${cx - 50}px, calc(100% - 10px))` }}
        >
          <tspan>{moment(payload.date).format('MMM DD hh:mm A')}</tspan>
        </text>
      </>
    )
  }

  _renderTimeMachineStamp(props) {
    const height = $('#timelineComponent').innerHeight()
    const cx = props.viewBox.x
    return (
      <>
        <rect
          style={{ transform: `translate(${cx - 55}px, ${height - 75}px)` }}
        />
        <text
          style={{ transform: `translate(${cx - 50}px, ${height - 60}px)` }}
        >
          <tspan>{moment(props.data).format('MMM DD hh:mm A')}</tspan>
        </text>
      </>
    )
  }

  _renderTimeMachineLine(props) {
    const cx = props.viewBox.x
    return (
      <path
        d="M-7,-4 h14 v20 l-7,7 l-7,-7 z"
        fill="#FCBD3F"
        style={{ transform: `translate(${cx}px, 0)` }}
      ></path>
    )
  }

  _calculateIndexes(props) {
    console.log("[TIMELINE:_calculateIndexes] ", props);
    console.log("[TIMELINE:_calculateIndexes] SIZE: " + this.state.chartPreviewData.length);

    if (props.endIndex == -1 || props.startIndex == -1) {
      console.log("[TIMELINE:_calculateIndexes] IS -1!!!!", props);
      return ;
    }

    let dateTo = null;
    let effectiveDateTo = null;
    if (props.endIndex >= this.state.chartPreviewData.length - 1)
    {
      dateTo = moment();
      effectiveDateTo = null;
    } else {
      dateTo = this.state.chartPreviewData[
        props.endIndex
      ].dateMoment;
      effectiveDateTo = dateTo.toISOString();
    }

    let dateFrom = this.state.chartPreviewData[
      props.startIndex
    ].dateMoment;

    let diff = moment.duration(dateTo.diff(dateFrom));
    let durationSeconds = diff.asSeconds();

    this.sharedState.set('time_machine_date_to', effectiveDateTo)
    this.sharedState.set('time_machine_duration', durationSeconds)
  }
  
  _handleChartClick(props) {
    this.sharedState.set('time_machine_enabled', true)
    this.sharedState.set('time_machine_target_date', props.date)
    if (!this.state.isTimeMachineActive) {
      this.sharedState.set('time_machine_date', props.date)
    }
  }

  componentDidMount() {
    
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

    return (
      <div id="timelineComponent" className="timeline size-to-parent">
        <div className="chart-view">
          <ResponsiveContainer className="main-chart">
            <ComposedChart
              data={this.state.chartData}
              barCategoryGap={0}
              barGap={0}
              syncId={1}
              margin={{ top: 5, right: 5, bottom: -5, left: 5 }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={this._formatXaxis}
                minTickGap={100}
                tickSize={5}
                allowDecimals={false}
                tickMargin={5}
              />
              <YAxis
                tick={false}
                type="number"
                domain={['dataMin', 'dataMax']}
              />

              <Legend
                align="left"
                layout="vertical"
                margin={{ right: 0 }}
                verticalAlign="middle"
              />

              <Area
                dataKey="warn"
                fill="#FCBD3F"
                stroke="none"
                fillOpacity={0.8}
                stackId="2"
                activeDot={false}
                legendType="triangle"
                isAnimationActive={false}
                connectNulls
              />
              <Area
                dataKey="error"
                fill="#9b6565"
                fillOpacity={1}
                stroke="none"
                stackId="2"
                activeDot={false}
                legendType="triangle"
                isAnimationActive={false}
                connectNulls
              />
              <Line
                dataKey="changes"
                stroke="#fff"
                type="monotone"
                dot={false}
                fillOpacity={1}
                stackId="1"
                activeDot={this._renderHoverTimeStamp}
                legendType="triangle"
                isAnimationActive={false}
                connectNulls
              />
              <Bar
                dataKey="changes"
                stroke="black"
                fillOpacity={0}
                strokeOpacity={0}
                background={{ fill: '#eee', stroke: '#eee', opacity: '0' }}
                stackId="3"
                onClick={this._handleChartClick}
                legendType="none"
              />
              {this.state.isTimeMachineActive &&
                <ReferenceLine
                  x={this.state.targetDate}
                  stroke="#FCBD3F"
                  isFront
                  strokeWidth={5}
                >
                  <Label
                    data={this.state.targetDate}
                    position="bottom"
                    content={this._renderTimeMachineStamp}
                  />
                  <Label content={this._renderTimeMachineLine} />
                </ReferenceLine>
              }
              <Tooltip
                labelStyle={{ color: '#9b6565' }}
                itemStyle={{ color: '#9b6565' }}
                contentStyle={{ color: '#9b6565' }}
                content={this._customTooltip}
                isAnimationActive={false}
                cursor={{ stroke: '#ffffffff', strokeOpacity: '1' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={40} className="brush-chart">
            <ComposedChart data={this.state.chartPreviewData} height={30} margin={{
                bottom: 10, left: 200,
                right: 50
            }}>
              <Brush
                dataKey="date"
                height={30}
                stroke="#9b6565"
                startIndex={this.state.selectionDateFromIndex}
                endIndex={this.state.selectionDateToIndex}
                onChange={debounce(this._calculateIndexes, 10)}
                tickFormatter={this._formatXaxis}
                gap={2}
                tick={true}
              >
                <ComposedChart data={this.state.chartPreviewData}>
                  <Area
                    dataKey="warn"
                    fill="#FCBD3F"
                    stroke="none"
                    fillOpacity={0.5}
                    stackId="2"
                    legendType="none"
                    isAnimationActive={false}
                    connectNulls
                  ></Area>
                  <Area
                    dataKey="error"
                    fill="#9b6565"
                    fillOpacity={0.3}
                    stroke="none"
                    stackId="2"
                    legendType="none"
                    isAnimationActive={false}
                    connectNulls
                  ></Area>
                  <Line
                    dataKey="changes"
                    stroke="#fff"
                    type="linear"
                    dot={false}
                    fillOpacity={0.5}
                    stackId="1"
                    legendType="none"
                    isAnimationActive={false}
                    connectNulls
                  ></Line>

                  {this.state.isTimeMachineActive &&
                    <ReferenceLine
                      x={this.state.targetDate}
                      stroke="#FCBD3F"
                      strokeOpacity={1}
                      isFront={true}
                      strokeWidth={2}
                    ></ReferenceLine>
                  }
                </ComposedChart>
                </Brush>
            </ComposedChart>
          </ResponsiveContainer>
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
          ></a>
        </div>
      </div>
    )
  }
}

export default Timeline
