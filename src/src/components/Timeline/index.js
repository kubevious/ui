import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import * as $ from 'jquery'
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
    this.previewLinePosition = 0

    this._calculateIndexes = this._calculateIndexes.bind(this)
    this._handleBrush = this._handleBrush.bind(this)
    this._renderTimeMachineLine = this._renderTimeMachineLine.bind(this)
  }

  _makeDefaultState()
  {
    return {
      isTimeMachineActive: false,
      targetDate: null,
      chartPreviewData: [],
      dateTo: null,
      actualDateTo: null,
      dateFrom: null,
      actualDateFrom: null,
      duration: 12 * 60 * 60
    };
  }

  _reset()
  {
    this.sharedState.set('time_machine_enabled', false)
    this.sharedState.set('time_machine_date_to', null)
    this.sharedState.set('time_machine_duration', 12 * 60 * 60)
    this.sharedState.set('time_machine_target_date', null);
    this.sharedState.set('time_machine_date', null);

    const brushChart = window.$brushChart
    brushChart.zoom(this._resetZoom())
  }

  _resetZoom() {
    const dateTo = moment()
    const dateFrom = moment().subtract(12 * 60 * 60, 'seconds')
    return [dateFrom, dateTo]
  }

  _toggleTimeMachine() {

    if (this.state.isTimeMachineActive) {
      $('.selector').detach()
      this.sharedState.set('time_machine_enabled', false)
    } else {
      this.sharedState.set('time_machine_enabled', true)
      let date = moment().toISOString()
      if (this.state.targetDate) {
        date = moment(this.state.targetDate).toISOString()
      } else {
        date = this.state.actualDateTo.toISOString()
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
    return [this.state.actualDateFrom, this.state.actualDateTo]
  }

  _renderTimeMachineLine(date, isActive, isMoving) {
    $('.selector').detach()
    if (isActive) {
      const chart = window.$mainChart

      const chartHeight = $('.main-chart .c3-event-rect').attr('height')

      const chartComponent = d3.select('.main-chart .c3-chart')
      const selector = chartComponent.append('g').attr('class', 'selector')
      selector.append('path').attr('d', 'M-7,0 h14 v20 l-7,7 l-7,-7 z')
      selector.append('path').attr('d', 'M0,15 v' + chartHeight).attr('class', 'selector-line')

      const brushComponent = d3.select('#chart .c3-brush')
      const brushSelector = brushComponent.append('g').attr('class', 'selector')
      brushSelector.append('path').attr('d', 'M0,0 v' + 30)

      if (chart) {
        selector.call(
          d3.drag().on('drag', () => {
            $('.main-chart .selector').attr(
              'transform',
              'translate(' + d3.event.x + ')'
            )
            this._calculatePreviewChartLine(d3.event.x, isMoving)
            const targetDate = chart.internal.x.invert(d3.event.x).toISOString()
            this.sharedState.set('time_machine_target_date', targetDate)
          })
        )
        this._renderLinePosition(date, isMoving)
      }
    }
  }

  _renderLinePosition(targetDate , isMoving) {
    const chart = window.$mainChart
    if (chart) {
      const targetDatePosition = chart.internal.x(moment(targetDate))
      if (
        targetDatePosition === Math.ceil(chart.internal.width / 2) ||
        targetDatePosition > chart.internal.width ||
        targetDatePosition <= 0 ||
        targetDatePosition === NaN
      ) {
        $('.main-chart .selector').detach()
      } else {
        $('.main-chart .selector').attr(
          'transform',
          'translate(' + targetDatePosition + ')'
        )
      }
      this._calculatePreviewChartLine(targetDatePosition, isMoving)
    }
  }

  _calculatePreviewChartLine(cursorX, isMoving) {
    if (cursorX && isMoving) {
      const brushStartIndex = Number($('#chart .c3-brush .selection').attr('x'))
      const brushWidth = Number($('#chart .c3-brush .selection').attr('width'))
      const chartWidth = Number($('.main-chart svg').attr('width'))
      const selectedPositionPercentage = cursorX / chartWidth
      this.previewLinePosition = brushStartIndex + brushWidth * selectedPositionPercentage
      $('#chart .selector').attr('transform', 'translate(' + this.previewLinePosition + ')')
    }
    else {
      $('#chart .selector').attr('transform', 'translate(' + this.previewLinePosition + ')')
    }
  }

  _handleChartClick() {
    const chart = window.$mainChart
    const self = this
    if (chart) {
      chart.internal.main.on('click', function () {
        const targetDate = chart.internal.x
          .invert(d3.mouse(this)[0])
          .toISOString()
        self.sharedState.set('time_machine_enabled', true)
        self.sharedState.set('time_machine_target_date', targetDate)

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

    this.sharedState.set('time_machine_date_to', effectiveDateTo)
    this.sharedState.set('time_machine_duration', durationSeconds)

    this._renderTimeMachineLine(this.state.targetDate, this.state.isTimeMachineActive, false)
  }

  _renderBrushChart() {
    const data = this.state.chartPreviewData
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
        onbrush: this._handleBrush,
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
        initialRange: this._calculateIndexes(),
      },
      legend: {
        position: 'right',
        hide: true
      }
    })
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
    const vertical = d3
      .select('.main-chart .c3-chart')
      .append('g')
      .attr('class', 'hover-line')
      .append('path')
      .attr('d', 'M0,' + chartHeight / 11 + ' v' + chartHeight)
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

  componentDidMount() {
    
    this.subscribeToSharedState(
      [
        'time_machine_enabled',
        'time_machine_target_date',
        'time_machine_timeline_preview',
        'time_machine_date_to',
        'time_machine_duration'
      ],
      ({
        time_machine_enabled,
        time_machine_target_date,
        time_machine_timeline_preview,
        time_machine_date_to,
        time_machine_duration
      }) => {
        
        console.log("[TIMLINE] TARGET DATE: ", moment(time_machine_target_date).toISOString());
        console.log("[TIMLINE] INPUT DURATION: ", time_machine_duration);
        console.log("[TIMLINE] INPUT TO: ", time_machine_date_to);

        let newState = this._makeDefaultState();

        this._renderTimeMachineLine(time_machine_target_date, time_machine_enabled, true)

        if (time_machine_enabled && time_machine_target_date)
        {
          newState.isTimeMachineActive = true;
        }
        newState.targetDate = time_machine_target_date;

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

        console.log("[TIMLINE] FINAL DURATION: " + newState.duration);
        console.log("[TIMLINE] FINAL ACTUAL FROM: " + newState.actualDateFrom.toISOString());
        console.log("[TIMLINE] FINAL ACTUAL TO:   " + newState.actualDateTo.toISOString());

        this.setState(newState);
        
      }
    )

    this.subscribeToSharedState('time_machine_timeline_data',
      (time_machine_timeline_data) => {
        this._updateMainChartData(time_machine_timeline_data);
    });

    this._renderMainChart()
    setTimeout(() => {
      this._renderBrushChart()
    }, 0)

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
      $('.main-chart .selector-line').attr('d', 'M0,15 v' + (mainChartheight - 30))
    })

    

  }

  render() {

    return (
      <div id="timelineComponent" className="timeline size-to-parent">
        <div className="chart-view">
          <div className="main-chart"></div>
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
