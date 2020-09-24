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
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  Label,
  Legend,
  Line,
} from 'recharts'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

import './styles.scss'
// import { this.timelineData } from '../../boot/timelineBoot'

class Timeline extends BaseComponent {
  constructor(props) {
    super(props)

    this._parentElem = null
    this._showAxis = false

    this.state = {
      activeIndex:
        this.sharedState.get('time_machine_timeline_data').length - 100,
      isTimeMachineActive: false,
      opacity: {
        errors: 0.8,
        changes: 0.8,
        warnings: 0.8,
      },
      selectedDate: new Date(),
    }
    // this.setupView()
    this._handleChartClick = this._handleChartClick.bind(this)
    this._handleChartDrag = this._handleChartDrag.bind(this)
  }

  get isTimeMachineEnabled() {
    return this.sharedState.get('time_machine_enabled')
  }

  get timeMachineDate() {
    return this.sharedState.get('time_machine_target_date')
  }

  get actualDateFrom() {
    return this.sharedState.get('time_machine_actual_date_from')
  }

  get actualDateTo() {
    return this.sharedState.get('time_machine_actual_date_to')
  }

  get dateFrom() {
    return this.sharedState.get('time_machine_date_from')
  }

  get dateTo() {
    return this.sharedState.get('time_machine_date_to')
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
      ? this.sharedState.get('time_machine_date')
      : new Date()
    const time_machine_target_date = this.sharedState.get(
      'time_machine_target_date'
    )
      ? this.sharedState.get('time_machine_target_date')
      : new Date()
    const time_machine_date_from = this.sharedState.get(
      'time_machine_date_from'
    )
      ? this.sharedState.get('time_machine_date_from')
      : new Date(Date.now() - 2864e5) // TODO: remove this minus, it's temporary solution to make mocks work

    this.sharedState.set('time_machine_date_to', time_machine_date_to)
    this.sharedState.set('time_machine_duration', time_machine_duration)
    this.sharedState.set('time_machine_enabled', time_machine_enabled)
    this.sharedState.set('time_machine_date', time_machine_date)
    this.sharedState.set('time_machine_target_date', time_machine_target_date)
    this.sharedState.set('time_machine_date_from', time_machine_date_from)
  }

  _setup() {
    $(document).on('layout-resize-timelineComponent', () => {
      this._setupDimentions()
    })

    this._setupDimentions()
  }

  _setupDimentions(size) {
    if (!size) {
      size = this._parentElem.node().getBoundingClientRect()
    }

    var margin = this._getMargin()

    this._width = size.width - margin.left - margin.right
    this._height = size.height - margin.top - margin.bottom
  }

  _getMargin() {
    var margin = {
      top: 10,
      right: 15,
      bottom: 25,
      left: 15,
    }

    if (this._showAxis) {
      margin.left += 40
      margin.lerightft += 40
    }

    return margin
  }

  _toggleTimeMachine() {
    // TODO: Refactor toggling to single action
    this.sharedState.set(
      'time_machine_enabled',
      !this.sharedState.get('time_machine_enabled')
    )
    if (this.state.isTimeMachineActive) {
      $('.timemachine').removeClass('active')
      this.setState({ isTimeMachineActive: false })
      this._removeTimeMachineInfo()
      this.sharedState.set(
        'time_machine_target_date',
        this.sharedState.get('time_machine_date_to')
      )
      this.sharedState.set(
        'time_machine_date',
        this.sharedState.get('time_machine_date_to')
      )
    } else {
      $('.timemachine').addClass('active')
      this.setState({ isTimeMachineActive: true })
      this._showTimeMachineInfo(this.state.activeIndex)
      this.sharedState.set('time_machine_target_date', null)
      this.sharedState.set('time_machine_date', null)
    }
  }

  // _handleTimelineClick() {
  //   if (this.state.isTimeMachineActive) {
  // const elemId = timelineData.findIndex((elem) => elem.date === data.date)
  // this.setState({
  //   activeIndex: elemId,
  // })
  // this._showTimeMachineInfo(elemId)
  //   }
  // }

  _formatXaxis(item) {
    return moment(item).format('MMM DD hh:mm A')
  }

  _customTooltip({ active, payload, label }) {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p>Errors: {payload[0].payload.errors}</p>
          <p>Changes: {payload[0].payload.changes}</p>
          <p>Warnings: {payload[0].payload.warnings}</p>
        </div>
      )
    }
  }

  _handleLegendMouseEnter = (o) => {
    const { dataKey } = o
    const { opacity } = this.state

    this.setState({
      opacity: { ...opacity, [dataKey]: 1 },
    })
  }

  _handleLegendMouseLeave = (o) => {
    const { dataKey } = o
    const { opacity } = this.state

    this.setState({
      opacity: { ...opacity, [dataKey]: 0.8 },
    })
  }

  _renderHoverTimeStamp({ payload, cx }) {
    return (
      <>
        <rect
          style={{ transform: `translate(${cx - 55}px, calc(100% - 70px))` }}
        />
        <text
          style={{ transform: `translate(${cx - 50}px, calc(100% - 55px))` }}
        >
          <tspan>{moment(payload.date).format('MMM DD hh:mm A')}</tspan>
        </text>
      </>
    )
  }

  _renderTimeMachineStamp(props) {
    const cx = props.viewBox.x
    return (
      <>
        <rect
          style={{ transform: `translate(${cx - 55}px, calc(100% - 70px))` }}
        />
        <text
          style={{ transform: `translate(${cx - 50}px, calc(100% - 55px))` }}
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

  _showTimeMachineInfo(index) {
    const currentItem = this.sharedState.get('time_machine_timeline_data')[
      index
    ].date
    const html =
      '<span>Time Machine Active: ' +
      moment(currentItem).format('MMM DD hh:mm:ss A') +
      '</span>'
    $('.history-info').html(html)
  }

  _calculateStartIndex() {
    const data = this.sharedState.get('time_machine_timeline_data')
    const targetDate = this.sharedState.get('time_machine_date_from')

    return data.findIndex((elem) =>
      moment(elem.date).isSame(targetDate, 'hour')
    )
  }

  _getDates(currentDate) {
    let stopDate = moment().subtract(14, 'days').toDate()
    var dateArray = [];
    while (moment(stopDate).isSameOrBefore(currentDate)) {
        dateArray.push(moment(stopDate).toDate())
        stopDate = moment(stopDate).add(1, 'days')
    }
    return dateArray;
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

  _handleChartDrag(props) {
    if (this.state.isTimeMachineActive) {
      const selectedIndex = this.sharedState
        .get('time_machine_timeline_data')
        .findIndex((elem) => elem.date === props.target.attributes[0].nodeValue)
      this.setState({ activeIndex: selectedIndex })
    }
  }

  _handleChartClick(props) {
    if (this.state.isTimeMachineActive) {
      const selectedIndex = this.sharedState
        .get('time_machine_timeline_data')
        .findIndex((elem) => elem.date === props.date)
      this.setState({ activeIndex: selectedIndex })
      this._showTimeMachineInfo(selectedIndex)
    }
  }

  componentDidMount() {
    this.subscribeToSharedState('time_machine_timeline_data', () => {
      this.setupView()
    })

    this.subscribeToSharedState(
      'time_machine_target_date',
      (time_machine_target_date) => {
        this._cancelPendingTimeouts()

        if (!time_machine_target_date) {
          this.sharedState.set('time_machine_date', null)
        } else {
          this._dateChangeTimerId = setTimeout(() => {
            this._cancelPendingTimeouts()

            this.sharedState.set('time_machine_date', time_machine_target_date)
          }, 250)
        }
      }
    )
  }

  render() {
    this._calculateStartIndex()
    const timelineAllData = this.sharedState.get('time_machine_timeline_data')
      ? this.sharedState.get('time_machine_timeline_data')
      : []
    const { errors, warnings, changes } = this.state.opacity
    const timelineData = timelineAllData.filter(elem => moment(elem.date).isSame(this.state.selectedDate, 'day'))
    const currentX =
      this.state.isTimeMachineActive &&
      timelineAllData[this.state.activeIndex].date
    return (
      <div id="timelineComponent" className="timeline size-to-parent">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={timelineData}
            margin={{
              top: 10,
              bottom: 10,
            }}
            barCategoryGap={0}
            barGap={0}
          >
            <XAxis
              dataKey="date"
              tickFormatter={this._formatXaxis}
              minTickGap={100}
              tickSize={15}
              allowDecimals={false}
            />
            <YAxis tick={false} type="number" domain={['dataMin', 'dataMax']} />
            <Tooltip
              labelStyle={{ color: '#9b6565' }}
              itemStyle={{ color: '#9b6565' }}
              contentStyle={{ color: '#9b6565' }}
              content={this._customTooltip}
            />
            <Legend
              align="left"
              layout="vertical"
              margin={{ right: 0 }}
              onMouseEnter={this._handleLegendMouseEnter}
              onMouseLeave={this._handleLegendMouseLeave}
              verticalAlign="middle"
            />
            <Brush
              dataKey="date"
              height={30}
              stroke="#9b6565"
              // startIndex={this._calculateStartIndex()}  // TODO: needs to be refactored
              tickFormatter={this._formatXaxis}
              gap={10}
              tick={true}
            >
              <AreaChart data={timelineData}>
                <Area
                  dataKey="changes"
                  fill="#aaa"
                  fillOpacity="1"
                  stroke="none"
                  type="step"
                />
                <ReferenceLine
                  x={this.state.isTimeMachineActive && this.state.activeIndex}
                  stroke="#FCBD3F"
                  strokeOpacity={1}
                  isFront={true}
                  strokeWidth={2}
                ></ReferenceLine>
              </AreaChart>
            </Brush>
            <Area
              dataKey="warnings"
              fill="#FCBD3F"
              stroke="none"
              fillOpacity={warnings}
              stackId="2"
              activeDot={false}
              legendType="triangle"
            ></Area>
            <Area
              dataKey="errors"
              fill="#9b6565"
              fillOpacity={errors}
              stroke="none"
              stackId="2"
              activeDot={false}
              legendType="triangle"
            ></Area>
            <Line
              dataKey="changes"
              stroke="#fff"
              type="linear"
              dot={false}
              fillOpacity={changes}
              stackId="1"
              activeDot={this._renderHoverTimeStamp}
              legendType="triangle"
            ></Line>
            <Bar
              dataKey="changes"
              fillOpacity={0}
              stroke="black"
              strokeOpacity={0}
              stackId="3"
              onClick={this._handleChartClick}
              legendType="none"
            />
            <ReferenceLine
              x={currentX}
              stroke="#FCBD3F"
              isFront={true}
              strokeWidth={5}
              onClick={this._handleChartDrag}
            >
              <Label
                value="▲"
                offset={0}
                position="bottom"
                className="selected-time-bottom"
                fill="#FCBD3F"
              />
              <Label
                data={currentX}
                position="bottom"
                content={this._renderTimeMachineStamp}
              />
              <Label content={this._renderTimeMachineLine} />
            </ReferenceLine>
          </ComposedChart>
        </ResponsiveContainer>
        <div className="tl-actions">
          <a
            role="button"
            id="btnTimelineTimeMachine"
            className="timemachine"
            onClick={() => this._toggleTimeMachine()}
          >
            <span className="tooltiptext">Activate Time Machine</span>
          </a>
          <DatePicker
            selected={this.state.selectedDate}
            onChange={date => this.setState({ selectedDate: date })}
            includeDates={this._getDates(new Date())}
            withPortal
          />
        </div>
      </div>
    )
  }
}

export default Timeline
