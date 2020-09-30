import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import $ from 'jquery'
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
      targetDate: new Date().toISOString(),
    }
    // this.setupView()
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

  get dateFrom() {
    if (!this.sharedState.get('time_machine_date_from')) {
      return new Date().toISOString();
    }
    return new Date(this.sharedState.get('time_machine_date_from')).toISOString();
  }

  get dateTo() {
    if (!this.sharedState.get('time_machine_date_to')) {
      return new Date().toISOString();
    }
    return new Date(this.sharedState.get('time_machine_date_to')).toISOString();
  }

  get durationHrs() {
    return this.sharedState.get('time_machine_duration')
  }

  setupView() {
    const time_machine_date_to = this.sharedState.get('time_machine_date_to')
      ? new Date(this.sharedState.get('time_machine_date_to'))
      : new Date()
    const time_machine_duration = this.sharedState.get('time_machine_duration')
      ? Number(this.sharedState.get('time_machine_duration'))
      : 24
    const time_machine_enabled = this.sharedState.get('time_machine_enabled')
      ? this.sharedState.get('time_machine_enabled')
      : false
    const time_machine_date = this.sharedState.get('time_machine_date')
      ? new Date(this.sharedState.get('time_machine_date'))
      : new Date()
    const time_machine_target_date = this.sharedState.get(
      'time_machine_target_date'
    )
      ? new Date(this.sharedState.get('time_machine_target_date')).toISOString()
      : new Date()
    const time_machine_date_from = (this.sharedState.get('time_machine_date_from') &&
      moment(this.sharedState.get('time_machine_date_from')).isBefore(time_machine_date_to))
      ? new Date(this.sharedState.get('time_machine_date_from'))
      : moment(time_machine_date_to).subtract(12, 'hours').toDate()
    
    this.setState({ isTimeMachineActive: time_machine_enabled })
    
    this.sharedState.set('time_machine_date_to', time_machine_date_to)
    this.sharedState.set('time_machine_duration', time_machine_duration)
    this.sharedState.set('time_machine_enabled', time_machine_enabled)
    this.sharedState.set('time_machine_date', time_machine_date)
    this.sharedState.set('time_machine_target_date', time_machine_target_date)
    this.sharedState.set('time_machine_date_from', time_machine_date_from)

    if (time_machine_enabled) {
      this._showTimeMachineInfo(time_machine_target_date)
    }
  }

  _toggleTimeMachine() {
    this.sharedState.set(
      'time_machine_enabled',
      !this.sharedState.get('time_machine_enabled')
    )
    if (this.state.isTimeMachineActive) {
      this.setState({ isTimeMachineActive: false })
      this._removeTimeMachineInfo()
    } else {
      this.setState({ isTimeMachineActive: true })
      this._showTimeMachineInfo(this.state.targetDate)
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
          {!this.state.isTimeMachineActive && <p className="activate-info">Click to activate Time Machine</p>} 
          <p>Errors: {payload[0].payload.errors}</p>
          <p>Changes: {payload[0].payload.changes}</p>
          <p>Warnings: {payload[0].payload.warnings}</p>
          </div>
          </>
      )
    }
  }

  _renderHoverTimeStamp({ payload, cx }) {
    return (
      <>
        <rect
          style={{ transform: `translate(${cx - 55}px, calc(100% - 35px))` }}
        />
        <text
          style={{ transform: `translate(${cx - 50}px, calc(100% - 20px))` }}
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
          style={{ transform: `translate(${cx - 55}px, ${height - 95}px)` }}
        />
        <text
          style={{ transform: `translate(${cx - 50}px, ${height - 80}px)` }}
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

  _showTimeMachineInfo(date) {
    const html =
      '<span>Time Machine Active: ' +
      moment(date).format('MMM DD hh:mm:ss A') +
      '</span>'
    $('.history-info').html(html)
  }

  _calculateIndexes(props) {
    const dateFrom = this.sharedState.get('time_machine_timeline_preview')[
      props.startIndex
    ].date
    this.sharedState.set('time_machine_date_from', dateFrom)
    const dateTo = this.sharedState.get('time_machine_timeline_preview')[
      props.endIndex
    ].date
    this.sharedState.set('time_machine_date_to', dateTo)

  }

  _calculateStartIndex(data) {
    const stateStartDate = moment(
      this.sharedState.get('time_machine_date_from')
    ).toDate()
    let startIndex = data.findIndex((elem) =>
      moment(elem.date).isSame(stateStartDate, 'hours')
    )
    if (startIndex === -1) {
      const searchDateFrom = moment(stateStartDate).subtract(1,'hours')
      const searchDateTo = moment(stateStartDate).add(1,'hours')
      startIndex = data.find((elem) =>
            moment(elem.date).isBetween(searchDateFrom, searchDateTo)
          )
    }
    return startIndex
  }

  _calculateEndIndex(data) {
    const stateEndDate = moment(
      this.sharedState.get('time_machine_date_to')
    ).toDate()
    const endIndex = data.findIndex((elem) =>
      moment(elem.date).isSame(stateEndDate, 'hour')
    )
    return endIndex
  }


  _removeTimeMachineInfo() {
    $('.history-info').html('')
  }

  _cancelPendingTimeouts() {
    if (this._dateChangeTimerId) {
      clearTimeout(this._dateChangeTimerId)
      this._dateChangeTimerId = null
    }
  }

  _handleChartClick(props) {
    if (!this.state.isTimeMachineActive) {
      this.setState({ isTimeMachineActive: true })
      this.sharedState.set('time_machine_enabled', true)
    }
      this._showTimeMachineInfo(props.date)
      this.sharedState.set('time_machine_target_date', props.date)
      this.sharedState.set('time_machine_date', props.date)
      this.setState({ targetDate: props.date})
  }

  componentDidMount() {
    this.subscribeToSharedState(
      'time_machine_timeline_data',
      (time_machine_timeline_data) => {
        this.setState({ chartData: time_machine_timeline_data })

        const time_machine_target_date = this.sharedState.get('time_machine_target_date')

        let targetElement = time_machine_timeline_data.find((elem) =>
          moment(elem.date).isSame(time_machine_target_date, 'minutes')
        )
        if (targetElement) {
          const targetDate = targetElement.date
          this.setState({ targetDate })
        } else {
          const searchDateFrom = moment(time_machine_target_date).subtract(10,'minutes')
          const searchDateTo = moment(time_machine_target_date).add(10,'minutes')
          targetElement = time_machine_timeline_data.find((elem) =>
            moment(elem.date).isBetween(searchDateFrom, searchDateTo)
          )
          if (targetElement) {
            const targetDate = targetElement.date
            this.setState({ targetDate })
          }
        }
        this.setupView()
      }
    )

    this.subscribeToSharedState(
      'time_machine_target_date',
      (time_machine_target_date) => {
        const selectedIndex = this.sharedState.get('time_machine_timeline_preview')
          .findIndex((elem) => moment(elem.date).isSame(time_machine_target_date, 'hours'))
        if (selectedIndex !== -1) {
          this.setState({ activeIndex: selectedIndex })
        } else {
          const closestIndex = this.sharedState.get('time_machine_timeline_preview')
            .findIndex((elem) => moment(elem.date).subtract(1, 'hours').isSame(time_machine_target_date, 'hours'))
          this.setState({ activeIndex: closestIndex })
        }
        this._cancelPendingTimeouts()
      }
    )
  }

  render() {
    const timelinePreviewData =
      this.sharedState.get('time_machine_timeline_preview') || []

    return (
      <div id="timelineComponent" className="timeline size-to-parent">
        <div className="chart-view">
          <ResponsiveContainer className="main-chart">
            <ComposedChart
              data={this.state.chartData}
              barCategoryGap={0}
              barGap={0}
              syncId={1}
            >
              <XAxis
                dataKey="date"
                tickFormatter={this._formatXaxis}
                minTickGap={100}
                tickSize={10}
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
                dataKey="warnings"
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
                dataKey="errors"
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
                type="natural"
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
            <ComposedChart data={timelinePreviewData} height={30} margin={{
                bottom: 10, left: 200,
                right: 50
            }}>
              <Brush
                dataKey="date"
                height={30}
                stroke="#9b6565"
                startIndex={this._calculateStartIndex(timelinePreviewData)}
                endIndex={this._calculateEndIndex(timelinePreviewData)}
                onChange={debounce(this._calculateIndexes, 10)}
                tickFormatter={this._formatXaxis}
                gap={2}
                tick={true}
              >
                <ComposedChart data={timelinePreviewData}>
                  <Area
                    dataKey="warnings"
                    fill="#FCBD3F"
                    stroke="none"
                    fillOpacity={0.5}
                    stackId="2"
                    legendType="none"
                    isAnimationActive={false}
                    connectNulls
                  ></Area>
                  <Area
                    dataKey="errors"
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
        </div>
      </div>
    )
  }
}

export default Timeline
