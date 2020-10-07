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

    this._handleChartClick = this._handleChartClick.bind(this)
    this._calculateIndexes = this._calculateIndexes.bind(this)
    this._handleBrush = this._handleBrush.bind(this)
    this._renderTimeMachineLine = this._renderTimeMachineLine.bind(this)
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
    this._renderBrushChart().zoom(this._resetZoom())
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
      this._renderTimeMachineLine()
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

  _renderTimeMachineLine() {
    $('.selector').detach()
    const chartHeight = $('.main-chart .c3-chart-lines')[0].getBoundingClientRect().height
    const chartComponent = d3.select('.main-chart .c3-chart')
    const selector = chartComponent
      .append('g')
      .attr('class', 'selector')
    selector.append('path').attr('d', 'M-7,0 h14 v20 l-7,7 l-7,-7 z')
    selector.append('path').attr('d', 'M0,15 v' + chartHeight)

    const brushComponent = d3.select('#chart .c3-brush')
    const brushSelector = brushComponent
      .append('g')
      .attr('class', 'selector')
    brushSelector.append('path').attr('d', 'M0,0 v' + 30)

    this._renderLinePosition()

    selector.call(
      d3.drag().on('drag', () => {
        $('.selector').attr('transform', 'translate(' + d3.event.x + ')')
        const element = document.querySelector(
          'circle[cx="' + Math.floor(d3.event.x) + '"]'
        ) // Will be rafactored to better logic
        if (element) {
          const index = element.className.baseVal
            .substr(element.className.baseVal.indexOf('c3-circle-'))
            .substr(10)
          $(element).toggleClass('_selected_')
          if (this.state.chartPreviewData[Number(index)]) {
            this.sharedState.set(
              'time_machine_target_date',
              this.state.chartPreviewData[Number(index)].date
            )
          }
        }
      })
    )
  }

  _renderLinePosition() {
    const posX = $('.main-chart .c3-selected-circle').attr('cx')
    $('.main-chart .selector').attr('transform', 'translate(' + posX + ')')
  }

  _handleChartClick(d, element) {
    this.sharedState.set('time_machine_enabled', true)
    this._renderTimeMachineLine()
    const posX = $(element).attr('cx')
    $('.main-chart .selector').attr('transform', 'translate(' + posX + ')')

    this.sharedState.set('time_machine_target_date', d.x.toISOString())

    const brushStartIndex = Number($('.c3-brush .selection').attr('x'))
    const brushWidth = Number($('.c3-brush .selection').attr('width'))
    const selectedPositionPercentage = d.index / 200
    const position = brushStartIndex + (brushWidth * selectedPositionPercentage)
    $('#chart .selector').attr('transform', 'translate(' + position + ')')
    
  }

  _handleBrush(domain) {
    const dateTo = moment(domain[1])
    const dateFrom = domain[0].toISOString()
    const effectiveDateTo = dateTo.toISOString()
          console.log("[TIMELINE:_calculateIndexes] ", domain);
          console.log("[TIMELINE:_calculateIndexes] SIZE: " + this.state.chartPreviewData.length);
      
          let diff = moment.duration(dateTo.diff(dateFrom));
          let durationSeconds = diff.asSeconds();
      
          this.sharedState.set('time_machine_date_to', effectiveDateTo)
    this.sharedState.set('time_machine_duration', durationSeconds)

    this._renderLinePosition()
  }

  _renderBrushChart() {
    const data = this.state.chartPreviewData
    const chart = c3.generate({
      padding: {
        left: 20,
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
            outer: true,
            multiline: false,
          },
        },
      },
      subchart: {
        show: true,
        onbrush: this._handleBrush,
        size: {
          height: 30
        }
      },
      zoom: {
        enabled: true,
        initialRange: this._calculateIndexes(),
      },
    })

    return chart
  }

  _renderMainChart() {
    const data = this.state.chartData

    const mainChart = c3.generate({
      bindto: '.main-chart',
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
          type: 'timeseries',
          tick: {
            format: '%b-%d %I:%M %p',
            count: 7,
            outer: true,
            multiline: false,
          },
        },
      },
      legend: {
        position: 'right',
        hide: true
      }
    })

    const chartHeight = $('.main-chart .c3-chart-lines')[0].getBoundingClientRect().height
    const vertical = d3
      .select('.main-chart .c3-chart')
      .append('g')
      .attr('class', 'hover-line')
      .append('path')
      .attr('d', 'M0,' + chartHeight / 10 + ' v' + chartHeight)
      

    d3.select('.main-chart .c3-chart')
      .on('mouseenter', function () {
        vertical.attr('display', 'block')
      })
      .on('mousemove', function () {
        let mousex = d3.mouse(this)
        mousex = mousex[0] + 5
        vertical.attr('transform', 'translate(' + mousex + ')')
      })
      .on('mouseover', function () {
        let mousex = d3.mouse(this)
        mousex = mousex[0] + 5
        vertical.attr('transform', 'translate(' + mousex + ')')
      })
      .on('mouseleave', function () {
        vertical.attr('display', 'none')
      })
    
    return mainChart
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
        this._renderMainChart()
      }
    )

  }

  render() {


    $(document).on('layout-resize-timelineComponent', () => { 
      this._renderBrushChart()
      this._renderMainChart()
    })
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
