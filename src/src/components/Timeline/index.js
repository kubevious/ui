import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import * as $ from 'jquery'
import _ from 'the-lodash'
import moment from 'moment'
import { formatDate } from '../../utils/ui-utils'
import c3 from 'c3'
import * as d3 from 'd3'
import TimelineButtons from '../TimelineButtons'

import './styles.scss'

class Timeline extends BaseComponent {
  constructor(props) {
    super(props)

    this.dayInSec = 12 * 60 * 60
    this.previewLinePosition = 0
    this.chartPreviewData = []
    this.isTimeMachineActive = false
    this.enableBrushLineCalc = true

    this._toggleTimeMachine = this._toggleTimeMachine.bind(this)
    this._reset = this._reset.bind(this)
    this._btnHandling = this._btnHandling.bind(this)

  }

  _reset()
  {
    this.sharedState.set('time_machine_enabled', false)
    this.sharedState.set('time_machine_date_to', null)
    this.sharedState.set('time_machine_duration', this.dayInSec)
    this.sharedState.set('time_machine_target_date', null)
  }

  _toggleTimeMachine() {

    if (this.isTimeMachineActive) {
      $('.selector').detach()
      this.sharedState.set('time_machine_enabled', false)
    } else {
      this.sharedState.set('time_machine_enabled', true)
      let date = moment().toISOString()
      if (this.targetDate) {
        date = this.targetDate
      } else {
        date = this.actualDateTo.toISOString()
      }
      this.sharedState.set('time_machine_target_date', date)
    }
  }

  _formatXaxis(item) {
    return moment(item).format('MMM DD hh:mm A')
  }

  _calculateIndexes() {
    if (!this.actualDateFrom && !this.actualDateTo) {
      return
    }
    return [this.actualDateFrom, this.actualDateTo]
  }

  _setTargetDate(mouseX) {
    const chart = window.$mainChart
    if (chart) {
      const targetDate = chart.internal.x.invert(mouseX).toISOString()
      this.sharedState.set('time_machine_target_date', targetDate)
    }

  }

  _renderTimeMachineLine(isActive) {
    $('.selector').detach()
    if (isActive) {
      const chartHeight = $('.main-chart .c3-event-rect').attr('height')

      const chartComponent = d3.select('.main-chart .c3-chart')
      const selector = chartComponent.append('g').attr('class', 'selector')
      selector.append('path').attr('d', 'M-7,0 h14 v20 l-7,7 l-7,-7 z')
      selector.append('path').attr('d', 'M0,15 v' + (chartHeight - 10)).attr('class', 'selector-line')

      const brushComponent = d3.select('#chart .c3-brush')
      const brushSelector = brushComponent.append('g').attr('class', 'selector')
      brushSelector.append('path').attr('d', 'M0,0 v' + 30)

      selector.call(
        d3.drag().on('drag', () => {
          $('.main-chart .selector').attr(
            'transform',
            'translate(' + d3.event.x + ')'
          )
          this._setTargetDate(d3.event.x)
        })
      )
    }
  }

  _renderLinePosition(targetDate, isMoving) {
    const chart = window.$mainChart
    if (chart) {
      const targetDatePosition = chart.internal.x(moment(targetDate))
      if (targetDatePosition !== (Math.ceil(chart.internal.width / 2) || NaN)) {
        $('.main-chart .selector').attr('transform','translate(' + targetDatePosition + ')')
        this._calculatePreviewChartLine(targetDatePosition, isMoving)
      }
    }
  }

  _calculatePreviewChartLine(cursorX, isMoving) {
      const brushStartIndex = Number($('#chart .c3-brush .selection').attr('x'))
      const brushWidth = Number($('#chart .c3-brush .selection').attr('width'))
      const chartWidth = Number($('.main-chart svg').attr('width'))
      const selectedPositionPercentage = cursorX / chartWidth
    if (this.enableBrushLineCalc || isMoving) {
      this.previewLinePosition = brushStartIndex + brushWidth * selectedPositionPercentage
      this.enableBrushLineCalc = false
    }
      $('#chart .selector').attr('transform', 'translate(' + this.previewLinePosition + ')')
  }

  _handleChartClick() {
    const chart = window.$mainChart
    const self = this
    if (chart) {
      chart.internal.main.on('click', function () {
        self.sharedState.set('time_machine_enabled', true)
        self._setTargetDate(d3.mouse(this)[0])

        $('.main-chart .selector').attr(
          'transform',
          'translate(' + d3.mouse(this)[0] + ')'
        )
      })
    }
  }

  _handleBrush(domain) {
    const dateTo = moment(domain[1])
    const dateFrom = domain[0].toISOString()
    const effectiveDateTo = dateTo.toISOString()
    console.log("[TIMELINE:_calculateIndexes] ", domain);

    let diff = moment.duration(dateTo.diff(dateFrom));
    let durationSeconds = diff.asSeconds();

    this._setDates(effectiveDateTo, durationSeconds)
  }

  _setDates(dateTo, duration) {
    this.sharedState.set('time_machine_date_to', dateTo)
    this.sharedState.set('time_machine_duration', duration)
  }

  _renderBrushChart() {
    const data = this.chartPreviewData
    window.$brushChart = c3.generate({
      padding: {
        left: 100,
        right: 20,
      },
      data: {
        json: data,
        xFormat: true,
        keys: {
          x: 'dateMoment',
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
          warn: '#fcbd3faa',
        },
      },
      axis: {
        y: {
          show: false,
        },
        x: {
          type: 'timeseries',
          tick: {
            format: '%b-%d %I:%M %p',
            count: 7,
            outer: false,
            multiline: false,
          },
        },
      },
      subchart: {
        show: true,
        onbrush: (d) => this._handleBrush(d),
        size: {
          height: 30
        },
        axis: {
          x: {
            show: false
          }
        }
      },
      zoom: {
        enabled: true,
      },
      legend: {
        position: 'right',
        hide: true
      }
    })

    const brushChart = window.$brushChart
    setTimeout(() => {brushChart.zoom([this.actualDateFrom, this.actualDateTo])})
  }

  _updateBrushChartData(data)
  {
    const brushChart = window.$brushChart
    if (brushChart) {
      brushChart.load({
        json: data,
        xFormat: true,
        keys: {
          x: 'dateMoment',
          value: ['error', 'warn', 'changes'],
        },
        types: {
          changes: 'line',
          error: 'area',
          warn: 'area',
        },
        groups: [['error', 'warn'], ['changes']],
      })
    }
  }

  _renderMainChart() {
    window.$mainChart = c3.generate({
      padding: {
        left: 100,
        right: 20,
      },
      bindto: '.main-chart',
      data: {
        json: [],
        xFormat: true,
        keys: {
          x: 'dateMoment',
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
          warn: '#fcbd3faa',
        },
        selection: {
          enabled: false,
        },
      },
      axis: {
        y: {
          show: false,
        },
        x: {
          type: 'timeseries',
          tick: {
            format: '%b-%d %I:%M %p',
            count: 7,
            outer: true,
            multiline: false,
          },
        },
      },
      point: {
        show: false
      },
      legend: {
        position: 'right',
      }
    })

    this._handleChartClick()
  }

  _updateMainChartData(data)
  {
    const chart = window.$mainChart
    if (chart) {
      chart.load({
        json: data,
        xFormat: true,
        keys: {
          x: 'dateMoment',
          value: ['error', 'warn', 'changes'],
        },
        types: {
          changes: 'line',
          error: 'area',
          warn: 'area',
        },
        groups: [['error', 'warn'], ['changes']],
      })
    }
  }

  _renderHoverLine(chartHeight) {
    const calculatedHeightDiff = chartHeight / 20
    const vertical = d3
      .select('.main-chart .c3-chart')
      .append('g')
      .attr('class', 'hover-line')
      .append('path')
      .attr('d', 'M0,' + (5 + calculatedHeightDiff) + ' v' + (chartHeight - 35 - calculatedHeightDiff))
      .attr('pointer-events', 'none')


    d3.select('.main-chart .c3-chart')
      .on('mouseenter', function () {
        vertical.attr('display', 'inherit')
      })
      .on('mousemove', function () {
        let mousex = d3.mouse(this)
        mousex = mousex[0]
        vertical.attr('transform', 'translate(' + mousex + ')')
      })
      .on('mouseover', function () {
        let mousex = d3.mouse(this)
        mousex = mousex[0]
        vertical.attr('transform', 'translate(' + mousex + ')')
      })
      .on('mouseleave', function () {
        vertical.attr('display', 'none')
      })
  }

  _btnHandling(setStatus) {
    this.setBtnStatus = setStatus
  }

  componentDidMount() {

    this._renderMainChart()
    setTimeout(() => {
      this._renderBrushChart()
    })

    this.subscribeToSharedState(
      [
        'time_machine_date_to',
        'time_machine_duration'
      ],
      ({
        time_machine_date_to,
        time_machine_duration
      }) => {

        console.log("[TIMLINE] INPUT DURATION: ", time_machine_duration);
        console.log("[TIMLINE] INPUT TO: ", time_machine_date_to);

        if (time_machine_duration) {
          this.duration = time_machine_duration;
        }
        if (time_machine_date_to) {
          this.dateTo = moment(time_machine_date_to);
          this.actualDateTo = this.dateTo.clone();
        } else {
          this.actualDateTo = moment();
        }

        this.dateFrom = this.actualDateTo.clone().subtract(this.duration, 'seconds');
        this.actualDateFrom = this.dateFrom.clone();

        console.log("[TIMLINE] FINAL DURATION: " + this.duration);
        console.log("[TIMLINE] FINAL ACTUAL FROM: " + this.actualDateFrom.toISOString());
        console.log("[TIMLINE] FINAL ACTUAL TO:   " + this.actualDateTo.toISOString());


        if (!time_machine_date_to && time_machine_duration === this.dayInSec) {
          const brushChart = window.$brushChart
          brushChart && brushChart.zoom([this.dateFrom, this.actualDateTo])
        }

        setTimeout(() => {
          this._renderLinePosition(this.targetDate, false)
        })

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

        const actualTargetDate = moment(time_machine_target_date).toISOString()

        console.log('[TIMLINE] TARGET DATE: ', actualTargetDate)

        setTimeout(() => {
          this._renderTimeMachineLine(time_machine_enabled)
          this._renderLinePosition(actualTargetDate, true)
        })
        this.setBtnStatus(time_machine_enabled)

        if (time_machine_enabled && time_machine_target_date) {
          this.isTimeMachineActive = true
        }
        this.targetDate = actualTargetDate
        if (!time_machine_enabled) {
          this.isTimeMachineActive = false
        }
      }
    )

    this.subscribeToSharedState('time_machine_timeline_data',
      (time_machine_timeline_data) => {
        this._updateMainChartData(time_machine_timeline_data);
    });

    this.subscribeToSharedState('time_machine_timeline_preview',
      (time_machine_timeline_preview) => {
        if (time_machine_timeline_preview) {
          this.chartPreviewData = time_machine_timeline_preview;
          this._updateBrushChartData(time_machine_timeline_preview)
          }
    });


    $(document).on('layout-resize-timelineComponent', () => {
      const mainChartheight = $('.chart-view').height() - 50
      const mainChartwidth = $('.chart-view').width()
      this._renderHoverLine(mainChartheight)
      const chart = window.$mainChart
      const brushChart = window.$brushChart
      if (chart && brushChart) {
        chart.resize({ height: mainChartheight, width: mainChartwidth })
        brushChart.resize({ width: mainChartwidth })
      }
      $('.main-chart .selector-line').attr('d', 'M0,15 v' + (mainChartheight - 50))
    })



  }

  render() {

    return (
      <div id="timelineComponent" className="timeline size-to-parent">
        <div className="chart-view">
          <div className="main-chart"></div>
          <div id="chart"></div>
        </div>
        <TimelineButtons toggleTimeMachine={this._toggleTimeMachine} reset={this._reset} btnHandling={this._btnHandling} />
      </div>
    )
  }
}

export default Timeline
