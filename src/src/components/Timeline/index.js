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

    this.state = {
      activeIndex: 0,
      isTimeMachineActive: false,
      chartData: [],
      targetDate: null,
    }
    this._handleChartClick = this._handleChartClick.bind(this)
    this._calculateIndexes = this._calculateIndexes.bind(this)
    this._customTooltip = this._customTooltip.bind(this)
  }

  get isTimeMachineEnabled() {
    return this.sharedState.get('time_machine_enabled')
  }

  get timeMachineDate() {
    return this.sharedState.get('time_machine_target_date')
  }

  get dateTo() {
    const value = this.state.dateTo;// this.sharedState.get('time_machine_date_to');
    if (!value) {
      return moment().toISOString();
    }
    return moment(value).toISOString();
  }

  get duration() {
    const duration = this.state.duration;
    if (!duration) {
       return 12 * 60 * 60;
    }
    return duration;
  }

  get dateFrom() {
    if (this.state.dateTo) {
      return moment(this.state.dateTo).subtract(this.duration, 'seconds').toDate();
    } else {
      return moment(this.dateTo).subtract(this.duration, 'seconds').toDate();
    }
  }

  get chartData() {
    const value = this.state.chartData;
    if (!value) {
      return [];
    }
    return value;
  }

  get chartPreviewData() {
    const value = this.state.chartPreviewData;
    if (!value) {
      return [];
    }
    return value;
  }

  _reset()
  {
    this.sharedState.set('time_machine_enabled', false)
    this.sharedState.set('time_machine_date_to', null)
    this.sharedState.set('time_machine_duration', 12 * 60 * 60)
    this.sharedState.set('time_machine_target_date', null);

    this.setState({
      dateTo: null,
      dateFrom: null,
      duration: 12 * 60 * 60
    })

    // window.location.href = '/'
  }

  _toggleTimeMachine() {
    this.sharedState.set(
      'time_machine_enabled',
      !this.sharedState.get('time_machine_enabled')
    )
    this.sharedState.set('time_machine_target_date', this.state.targetDate)
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
    let dateTo = null;
    let effectiveDateTo = null;
    if (props.endIndex != -1 && props.endIndex < this.chartPreviewData.length)
    {
      if (props.endIndex != this.chartPreviewData.length - 1)
      {
        dateTo = this.chartPreviewData[
          props.endIndex
        ].dateMoment;
        effectiveDateTo = dateTo.toISOString();
      }
      else 
      {
        dateTo = moment();
      }
    } else {
      dateTo = moment();
    }

    let dateFrom = null;
    if (props.startIndex != -1 && props.startIndex < this.chartPreviewData.length)
    {
      dateFrom = this.chartPreviewData[
        props.startIndex
      ].dateMoment;
    } else {
      dateFrom = moment();
    }

    let diff = moment.duration(dateTo.diff(dateFrom));
    let durationSeconds = diff.asSeconds();

    this.sharedState.set('time_machine_date_to', effectiveDateTo)
    this.sharedState.set('time_machine_duration', durationSeconds)
  }

  _calculateStartIndex() {
    let index = -1;
    const dateFrom = this.state.dateFrom || this.dateFrom;
    if (!dateFrom) {
      index = 0;
    } else {
      index = _.findIndex(this.chartPreviewData, elem => {
        return elem.dateMoment.isSameOrAfter(dateFrom);
      })
    }
    return Math.max(0, index);
  }

  _calculateEndIndex() {
    let index = -1;
    const dateTo = this.state.dateTo || this.dateTo;
    if (!dateTo) {
      index = this.chartPreviewData.length - 1;
    } else {
      index = _.findLastIndex(this.chartPreviewData, elem => {
        return elem.dateMoment.isSameOrBefore(dateTo);
      })
    }
    return Math.max(0, index);
  }

  _handleChartClick(props) {
    if (!this.state.isTimeMachineActive) {
      this.setState({ isTimeMachineActive: true })
      this.sharedState.set('time_machine_enabled', true)
    }
    this.sharedState.set('time_machine_target_date', props.date)
    this.setState({ targetDate: props.date })
  }

  componentDidMount() {
    this.setState({ targetDate: this.timeMachineDate })

    this.subscribeToSharedState(
      [
        'time_machine_date_to',
        'time_machine_duration'
      ],
      ({ 
        time_machine_date_to,
        time_machine_duration
      }) => {
        console.log("[TIMELINE] time_machine_date_to or time_machine_duration changed.");

        const dateFrom = moment(time_machine_date_to).subtract(this.duration, 'seconds').toISOString()
        this.setState({ 
          dateTo: time_machine_date_to,
          duration: time_machine_duration,
          dateFrom,
        })
      }
    );

    this.subscribeToSharedState(
      [
        'time_machine_enabled'
      ],
      ({ 
        time_machine_enabled
      }) => {
        this.setState({ isTimeMachineActive: time_machine_enabled })
      }
    );
    
    this.subscribeToSharedState(
      [
        'time_machine_timeline_data',
        'time_machine_timeline_preview',
        'time_machine_target_date'
      ],
      ({ 
        time_machine_timeline_data, 
        time_machine_timeline_preview,
        time_machine_target_date 
      }) => {

        console.log("time_machine_timeline_preview: ", time_machine_timeline_preview)

        this.setState({ chartData: time_machine_timeline_data || [] })
        this.setState({ chartPreviewData: time_machine_timeline_preview || [] })

        let targetElement = this.chartData.find((elem) =>
          elem.dateMoment.isSame(time_machine_target_date, 'minutes')
        )
        if (targetElement) {
          const targetDate = targetElement.date
          this.setState({ targetDate })
        } else {
          const searchDateFrom = moment(time_machine_target_date).subtract(20,'minutes')
          const searchDateTo = moment(time_machine_target_date).add(20,'minutes')
          targetElement = this.chartData.find((elem) =>
            elem.dateMoment.isBetween(searchDateFrom, searchDateTo)
          )
          if (targetElement) {
            const targetDate = targetElement.date
            this.setState({ targetDate })
          }
        }

        if (time_machine_target_date)
        {
          const selectedIndex = this.chartPreviewData
            .findIndex((elem) => elem.dateMoment.isSame(time_machine_target_date, 'hours'))
          if (selectedIndex !== -1) {
            this.setState({ activeIndex: selectedIndex })
          } else {
            const closestIndex = this.chartPreviewData
              .findIndex((elem) => elem.dateMoment.subtract(1, 'hours').isSame(time_machine_target_date, 'hours'))
            this.setState({ activeIndex: closestIndex })
          }
        }

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
              <ReferenceLine
                x={this.state.isTimeMachineActive &&
                   this.state.targetDate}
                stroke="#FCBD3F"
                isFront
                strokeWidth={5}
              >
                <Label
                  data={this.state.isTimeMachineActive &&
                        this.state.targetDate}
                  position="bottom"
                  content={this._renderTimeMachineStamp}
                />
                <Label content={this._renderTimeMachineLine} />
              </ReferenceLine>
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
            <ComposedChart data={this.chartPreviewData} height={30} margin={{
                bottom: 10, left: 200,
                right: 50
            }}>
              <Brush
                dataKey="date"
                height={30}
                stroke="#9b6565"
                startIndex={this._calculateStartIndex(this.chartPreviewData)}
                endIndex={this._calculateEndIndex(this.chartPreviewData)}
                onChange={debounce(this._calculateIndexes, 10)}
                tickFormatter={this._formatXaxis}
                gap={2}
                tick={true}
              >
                <ComposedChart data={this.chartPreviewData}>
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
                  <ReferenceLine
                    x={this.state.isTimeMachineActive && this.state.activeIndex}
                    stroke="#FCBD3F"
                    strokeOpacity={1}
                    isFront={true}
                    strokeWidth={2}
                  ></ReferenceLine>
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
