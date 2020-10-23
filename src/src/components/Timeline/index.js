import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import * as $ from 'jquery'
import _ from 'the-lodash'
import moment from 'moment'
import { formatDate } from '../../utils/ui-utils'
import * as d3 from 'd3'
import TimelineButtons from '../TimelineButtons'
import TimelineUtils from '../../utils/timeline-utils'

import './styles.scss'

class Timeline extends BaseComponent {
  constructor(props) {
    super(props)

    this.actualTargetDate = null
    this._isDraggingSelector = false

    this.time_machine_actual_date_range = {
      from: moment(),
      to: moment(),
    }

    this.dayInSec = 12 * 60 * 60
    this.chartPreviewData = []
    this._timelineUtils = new TimelineUtils(this.sharedState)
    this._parentElem = null
    this._showAxis = false
  }

  zoomIn() {
    this.sharedState.set('time_machine_duration', Math.max(1, this.durationSeconds / 2))
  }

  zoomOut() {
    this.sharedState.set('time_machine_duration', Math.max(1, this.durationSeconds * 2))
  }

  onUserPanLeft() {
    d3.select('.x-brush').call(this._brush.move, this._calcShiftDate(-this.durationSeconds / 2))
  }

  onUserPanRight() {
    d3.select('.x-brush').call(this._brush.move, this._calcShiftDate(this.durationSeconds / 2))
  }

  _calcShiftDate(diffSeconds) {
    const startDate = moment(this.time_machine_actual_date_range.from).add(diffSeconds, 'seconds')
    const endDate = moment(this.time_machine_actual_date_range.to).add(diffSeconds, 'seconds')

    const startPos = this._subXScale(startDate)
    const endPos = this._subXScale(endDate)
    return [startPos, endPos]
  }

  _setup() {
    this._mainSvgElem = this._parentElem
      .insert('svg', ':first-child')
      .attr('position', 'absolute')
      .attr('overflow', 'hidden')
      .attr('top', 0)
      .attr('left', 0)
      .attr('right', 0)
      .attr('bottom', 0)
      .attr('width', '100%')
      .attr('height', 'calc(100% - 50px)')

    this._mainChartElem = this._mainSvgElem
      .append('g')
      .attr('class', 'main-chart')
      .attr('transform', 'translate(0, 0)')

    this._axisElem = this._mainChartElem.append('g').attr('class', 'axis')

    this._chartsElem = this._mainChartElem.append('g').attr('class', 'charts')

    this._chartsElem.on('click', this._onUserChartClick.bind(this))

    this._selectorElem = this._mainChartElem
      .append('g')
      .attr('class', 'selector')
      .call(d3.drag().on('drag', this._onUserDragSelector.bind(this)))

    this._subSvgElem = this._parentElem
      .insert('svg')
      .attr('position', 'absolute')
      .attr('overflow', 'hidden')
      .attr('top', 0)
      .attr('left', 0)
      .attr('right', 0)
      .attr('bottom', 0)
      .attr('width', '100%')
      .attr('height', '50px')

    this._subchartAxisElem = this._subSvgElem
      .append('g')
      .attr('class', 'subchart-axis')

    this._subElemCharts = this._subSvgElem
      .append('g')
      .attr('class', 'brush-charts')

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
    this._height = size.height - margin.top - margin.bottom - 40

    var viewBox = [
      -margin.left,
      0,
      this._width + margin.left + margin.right,
      this._height + margin.top + margin.bottom - 20,
    ]
    this._mainSvgElem.attr('viewBox', viewBox.join(' '))
    const subViewBox = [
      -margin.left,
      0,
      this._width + margin.left + margin.top,
      50,
    ]
    this._subSvgElem.attr('viewBox', subViewBox.join(' '))

    this._renderTimeline()
  }

  _getMargin() {
    var margin = {
      top: 10,
      right: 15,
      bottom: 30,
      left: 15,
    }

    if (this._showAxis) {
      margin.left += 40
      margin.lerightft += 40
    }

    return margin
  }

  _renderTimeline() {
    this._setupChartScales()

    this._setupSubChartScales()

    this._renderCharts()

    this._renderAxis()

    this._renderSubchartAxis()

    this._renderSelector()

    this._updateSelectorPosition()

    if (this.chartPreviewData.length > 0) {
      this._renderSubCharts()
    }

    this._renderSubchartBrush()
  }

  _setupChartScales() {
    if (
      this.chartData &&
      this.chartPreviewData.length &&
      this.time_machine_actual_date_range.from &&
      this.time_machine_actual_date_range.to
    ) {
      this._xScale = d3
        .scaleTime()
        .domain([
          this.time_machine_actual_date_range.to
            .clone()
            .subtract('12', 'hours'),
          this.time_machine_actual_date_range.to,
        ])
        .range([0, this._width])
      this._yScaleChanges = d3
        .scaleLinear()
        .domain(
          d3.extent(this.chartData, function (d) {
            return d.changes
          })
        )
        .range([this._height, 0])
      this._yScaleWarnings = d3
        .scaleLinear()
        .domain(
          d3.extent(this.chartData, function (d) {
            return d.warn
          })
        )
        .range([this._height, 0])
      this._yScaleErrors = d3
        .scaleLinear()
        .domain(
          d3.extent(this.chartData, function (d) {
            return d.error
          })
        )
        .range([this._height, 0])
    }
  }

  _setupSubChartScales() {
    const head = _.head(this.chartPreviewData)
    const last = _.last(this.chartPreviewData)
    this._subXScale = d3
      .scaleTime()
      .domain([
        head ? head.dateMoment : moment().subtract('12', 'hours'),
        last ? last.dateMoment : moment(),
      ])
      .range([0, this._width])
    this._subYScaleChanges = d3
      .scaleLinear()
      .domain(
        d3.extent(this.chartPreviewData, function (d) {
          return d.changes
        })
      )
      .range([30, 0])
    this._subYScaleWarnings = d3
      .scaleLinear()
      .domain(
        d3.extent(this.chartPreviewData, function (d) {
          return d.warn
        })
      )
      .range([30, 0])
    this._subYScaleErrors = d3
      .scaleLinear()
      .domain(
        d3.extent(this.chartPreviewData, function (d) {
          return d.error
        })
      )
      .range([30, 0])
  }

  _renderCharts() {
    if (this.chartData && this._xScale) {
      {
        const errors = d3
          .area()
          .x((d) => {
            return this._xScale(d.dateMoment)
          })
          .y0(this._height)
          .y1((d) => {
            return this._yScaleErrors(d.error)
          })
        this._renderChart(errors, 'errors')
      }

      {
        const warnings = d3
          .area()
          .x((d) => {
            return this._xScale(d.dateMoment)
          })
          .y0(this._height)
          .y1((d) => {
            return this._yScaleWarnings(d.warn)
          })
        this._renderChart(warnings, 'warnings')
      }

      {
        const changes = d3
          .line()
          .x((d) => {
            return this._xScale(d.dateMoment)
          })
          .y((d) => {
            return this._yScaleChanges(d.changes)
          })

        this._renderChart(changes, 'changes')
      }
    }
  }

  _renderSubCharts() {
    if (this.chartPreviewData.length > 0) {
      {
        const brushErrors = d3
          .area()
          .x((d) => {
            return this._subXScale(d.dateMoment)
          })
          .y0(30)
          .y1((d) => {
            return this._subYScaleErrors(d.error)
          })
        this._renderSubchart(brushErrors, 'errors')
      }

      {
        const brushWarnings = d3
          .area()
          .x((d) => {
            return this._subXScale(d.dateMoment)
          })
          .y0(30)
          .y1((d) => {
            return this._subYScaleWarnings(d.warn)
          })
        this._renderSubchart(brushWarnings, 'warnings')
      }

      {
        const brushChanges = d3
          .line()
          .x((d) => {
            return this._subXScale(d.dateMoment)
          })
          .y((d) => {
            return this._subYScaleChanges(d.changes)
          })

        this._renderSubchart(brushChanges, 'changes')
      }
    }
  }

  _renderAxis() {
    this._axisElem.html('')
    if (this.chartData && this._xScale) {
      var horizontalTickCount = Math.max(1, this._width / 200)
      this._axisElem
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + this._height + ')')
        .call(
          d3
            .axisBottom(this._xScale)
            .tickFormat(function (d) {
              return formatDate(d)
            })
            .ticks(horizontalTickCount)
        )

      if (this._showAxis) {
        var verticalTickCount = Math.max(1, this._height / 20)
        this._axisElem
          .append('g')
          .attr('class', 'y axis')
          .call(d3.axisLeft(this._yScaleChanges).ticks(verticalTickCount))

        this._axisElem
          .append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(' + this._width + ', 0)')
          .call(d3.axisRight(this._yScaleWarnings).ticks(verticalTickCount))

        this._axisElem
          .append('g')
          .attr('class', 'y axis')
          .attr('transform', 'translate(' + this._width + ', 0)')
          .call(d3.axisRight(this._yScaleErrors).ticks(verticalTickCount))
      }
    }
  }

  _renderSubchartAxis() {
    if (this.chartPreviewData) {
      this._subXAxis = d3.axisBottom(this._subXScale)
      this._subYAxisChanges = d3.axisLeft(this._subYScaleChanges)
      this._subchartAxisElem.html('')

      this._subchartAxisElem
        .append('g')
        .classed('x axis', true)
        .attr('transform', 'translate(0, ' + 30 + ')')
        .call(this._subXAxis)

      if (this._showAxis) {
        this._subchartAxisElem
          .append('g')
          .classed('y axis', true)
          .attr('transform', 'translate(0, 0)')
          .call(this._subYAxisChanges)
      }
    }
  }

  _renderSubchartBrush() {
    if (this.chartPreviewData.length > 0) {
      const self = this
      this._brush = d3.brushX(this._subXScale)
        .on('brush', function() {
            self._onUserBrushMove(this)
      })
      const startPos = this._subXScale(this.time_machine_actual_date_range.from)
      const endPos = this._subXScale(this.time_machine_actual_date_range.to)

      this._subSvgElem
        .append('g')
        .classed('x-brush', true)
        .call(this._brush)
        .call(this._brush.move, [startPos, endPos])
        .selectAll('rect')
        .attr('y', 0)
        .attr('height', 30)
    }
  }

  _onUserBrushMove(self) {
    const dateTo = moment(this._subXScale.invert(d3.brushSelection(self)[1]))
    const dateFrom = moment(this._subXScale.invert(d3.brushSelection(self)[0]))

    let diff = moment.duration(dateTo.diff(dateFrom))
    let durationSeconds = diff.asSeconds().toFixed()

    let lastDate = this.sharedState.get('time_machine_timeline_preview_last_date')
    if (dateTo.isSameOrAfter(lastDate))
    {
      this.sharedState.set('time_machine_date_to', null)
    }
    else
    {
      this.sharedState.set('time_machine_date_to', dateTo.toISOString())
    }
    this.sharedState.set('time_machine_duration', durationSeconds)
  }

  _renderSelector() {
    this._selectorElem.html('')

    if (this._subchartSelectorElem) {
      this._subchartSelectorElem.html('')
    }

    if (!this.actualTargetDate) {
      return
    }

    var margin = this._getMargin()
    this._selectorElem
      .append('path')
      .attr('d', 'M-7,' + -0.4 * margin.top + ' h14 v20 l-7,7 l-7,-7 z')
    this._selectorElem
      .append('path')
      .attr(
        'd',
        'M0,' + -0.4 * margin.top + ' v' + (this._height + margin.top * 0.7)
    )

    this._renderSubchartSelector()
  }

  _updateSelectorPosition() {
    if (this._xScale) {
      const selectorPositionX = this._xScale(moment(this.actualTargetDate))
    // if (selectorPositionX < 0 || selectorPositionX > this._width) {   // Perhaps will be usable
    // }
    this._selectorElem.attr('transform', 'translate(' + selectorPositionX + ')')
    }
  }

  _renderChart(chartObj, chartClass) {
    if (this.chartData) {
      const stack = d3.stack().keys(['error', 'warn'])
      const stackedData = stack(this.chartData)
      const charts = this._chartsElem
        .selectAll('.' + chartClass)
        .data([this.chartData])
        .attr('class', chartClass)

      charts.exit().remove()

      charts
        .enter()
        .append('path')
        .attr('class', chartClass)
        .attr('d', chartObj)
        .merge(charts)
        .attr('d', chartObj)
    }
  }

  _renderSubchart(chartObj, chartClass) {
    if (this.chartPreviewData) {
      const brushCharts = this._subElemCharts
        .append('path')
        .datum(this.chartPreviewData)
        .attr('class', chartClass)
        .attr('d', chartObj)
    }
  }

  _onUserDragSelector() {
    this._selectorElem.attr('transform', 'translate(' + d3.event.x + ', 0)')
    var date = new Date(this._xScale.invert(d3.event.x))
    if (date < this.time_machine_actual_date_range.from) {
      date = this.time_machine_actual_date_range.from
    }
    if (date > this.time_machine_actual_date_range.to) {
      date = this.time_machine_actual_date_range.to
    }

    this.sharedState.set('time_machine_target_date', date)
  }

  _cancelPendingTimeouts() {
    if (this._dateChangeTimerId) {
      clearTimeout(this._dateChangeTimerId)
      this._dateChangeTimerId = null
    }
  }

  _formatXaxis(item) {
    return moment(item).format('MMM DD hh:mm A')
  }

  _setTargetDate(mouseX) {
    // $('.main-chart .selector').attr(
    //   'transform',
    //   'translate(' + mouseX + ')'
    // )
    // if (this.mainChartElem) {
    //   const targetDate = this.mainChartElem.internal.x.invert(mouseX).toISOString()
    //   this.sharedState.set('time_machine_target_date', targetDate)
    // }
  }

  _setupBrushSelectionRange(actual) {
    // this.mainXScale.domain([this.from, this.to]);
    // this.main.select(".area").attr("d", this.mainArea);
    // this.main.select(".x.axis").call(this.mainXAxis);
    // this._refreshMainData(this.from, this.to);
  }

  _removeTimeMachineLine() {
    // if (this.mainChartSelectorElem) {
    //   this.mainChartSelectorElem.remove();
    //   this.mainChartSelectorElem = null;
    // }
  }

  _updateTimeMachineSelectorLinePosition()
  {
    // if (!this.mainChartElem) {
    //   return;
    // }
    // const targetDatePosition = this.mainChartElem.internal.x(moment(this.actualTargetDate))
    // $('.main-chart .selector')
    //   .attr('display', 'block')
    //   .attr('transform','translate(' + targetDatePosition + ')')
  }

  _renderSubchartSelector()
  {
    this._subchartSelectorElem = this._subSvgElem
    .append('g')
    .attr('class', 'sub-selector')

      this._subchartSelectorElem.append('path').attr('d', 'M0,0 v' + 30)
      this._updateSubchartSelectorPosition()
  }

  _updateSubchartSelectorPosition()
  {
    const date = moment(this.actualTargetDate);
    const position = this._subXScale(date)
    this._subchartSelectorElem.attr('transform','translate(' + position + ')')
  }

  _onUserChartClick() {
    const date = this._xScale.invert(d3.event.x - 25) //  Temporary substraction because of wrong position calculating
    this.sharedState.set('time_machine_enabled', true)
    this.sharedState.set('time_machine_target_date', date)
  }

  _massageData(data)
  {
    if (data)
    {
      if (data.length > 0)
      {
        return data
      }
    }
    return [{
        dateMoment: moment(),
        error: 0,
        warn: 0,
        changes: 0
      }]
  }

  _renderHoverLine() {
    // const vertical = d3
    //   .select('.main-chart .c3-chart')
    //   .append('g')
    //   .attr('class', 'hover-line')
    //   .append('path')
    //   .attr('pointer-events', 'none')

    // this.verticalElem = vertical;

    // d3.select('.main-chart .c3-chart')
    //   .on('mouseenter', function () {
    //     vertical.attr('display', 'inherit')
    //   })
    //   .on('mousemove', function () {
    //     let mousex = d3.mouse(this)
    //     mousex = mousex[0]
    //     vertical.attr('transform', 'translate(' + mousex + ')')
    //   })
    //   .on('mouseover', function () {
    //     let mousex = d3.mouse(this)
    //     mousex = mousex[0]
    //     vertical.attr('transform', 'translate(' + mousex + ')')
    //   })
    //   .on('mouseleave', function () {
    //     vertical.attr('display', 'none')
    //   })
  }

  _updateHoverLineHeight(chartHeight)
  {
    // if (!this.verticalElem) {
    //   return;
    // }
    // const calculatedHeightDiff = chartHeight / 20
    // this.verticalElem.attr('d', 'M0,' + (5 + calculatedHeightDiff) + ' v' + (chartHeight - 35 - calculatedHeightDiff));
  }

  _activateMainChartRange()
  {
    // if (!this.mainChartElem) {
    //   return;
    // }
    // console.log('[_activateMainChartRange] FROM:', this.time_machine_actual_date_range.from);
    // console.log('[_activateMainChartRange]   TO:', this.time_machine_actual_date_range.to);

    // if (!this.time_machine_actual_date_range.from ||
    //     !this.time_machine_actual_date_range.to)
    // {
    //   this.mainChartElem.axis.range({});
    // }
    // else
    // {
    //   this.mainChartElem.axis.range({
    //     min: {
    //       x: this.time_machine_actual_date_range.from
    //     },
    //     max: {
    //       x: this.time_machine_actual_date_range.to
    //     }
    //   });

    // }
  }

  _dateRangesAreSame(newActual)
  {
    return this._datesAreSame(this.time_machine_actual_date_range.from, newActual.from) &&
      this._datesAreSame(this.time_machine_actual_date_range.to, newActual.to)
  }

  _datesAreSame(oldDate, newDate)
  {
    if (oldDate) {
      return oldDate.isSame(newDate)
    }
    return false
  }

  componentDidMount() {

    this._parentElem = d3.select('.chart-view')
    this._setup()

    this.subscribeToSharedState(
      [
        'time_machine_actual_date_from',
        'time_machine_actual_date_to'
      ],
      () => {
        let actual = this._timelineUtils.getActualRange()

        console.log('[subscribeToSharedState] CURR From: ', this.time_machine_actual_date_range.from.toISOString())
        console.log('[subscribeToSharedState] CURR  To: ', this.time_machine_actual_date_range.to.toISOString())

        console.log('[subscribeToSharedState] From: ', actual.from.toISOString())
        console.log('[subscribeToSharedState]   To: ', actual.to.toISOString())

        if (this._dateRangesAreSame(actual)) {
          return
        }

        let diff = moment.duration(actual.to.diff(actual.from))
        this.durationSeconds = diff.asSeconds()

        this.time_machine_actual_date_range = actual
        this._updateSelectorPosition()
        // this._setupBrushSelectionRange(this.time_machine_actual_date_range);
        // this._setupTimeMachineTargetDate();
      }
    )

    this.subscribeToSharedState(
      [
        'time_machine_enabled',
        'time_machine_target_date'
      ],
      ({
        time_machine_enabled,
        time_machine_target_date
      }) => {

        this.actualTargetDate = moment(time_machine_target_date).toISOString()

        if (!time_machine_enabled || !time_machine_target_date) {
          this.actualTargetDate = null
        }
        this._renderSelector()
        this._updateSelectorPosition()

        // this._setupTimeMachineTargetDate();
      }
    )

    this.subscribeToSharedState('time_machine_timeline_data',
      (time_machine_timeline_data) => {
        this.chartData = this._massageData(time_machine_timeline_data)
        // this._updateMainChartData(time_machine_timeline_data);
        // this._setupTimeMachineTargetDate()
        // this._renderTimeline()
        // this._renderCharts()
        this._setupChartScales()
        this._renderCharts()
        this._renderAxis()
      }
    )

    this.subscribeToSharedState('time_machine_timeline_preview',
      (time_machine_timeline_preview) => {
        this.chartPreviewData = this._massageData(time_machine_timeline_preview)
        // this._updateBrushChartData()
        // this._setupTimeMachineTargetDate()
      }
    )

    $('.plus').on('click', () => this.zoomOut())
    $('.minus').on('click', () => this.zoomIn())
    $('.left').on('click', () => this.onUserPanLeft())
    $('.right').on('click', () => this.onUserPanRight())
  }

  render() {
    return (
      <div id="timelineComponent" className="timeline size-to-parent">
        <div className="chart-view">
        </div>
        <div className="tl-actions">
          <TimelineButtons />
          <a role="button" className="plus" />
          <a role="button" className="minus" />
          <a role="button" className="left" />
          <a role="button" className="right" />
        </div>
      </div>
    )
  }
}

function isValidDate(date)
{
  if (!date) {
    return false
  }
  if (Object.prototype.toString.call(date) === '[object Date]') {
    // it is a date
    if (isNaN(date.getTime())) {  // d.valueOf() could also work
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

export default Timeline
