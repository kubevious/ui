import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import * as $ from 'jquery'
import _ from 'the-lodash'
import moment from 'moment'
import { formatDate } from '../../utils/ui-utils'
import c3 from 'c3'
import * as d3 from 'd3'
import TimelineButtons from '../TimelineButtons'
import TimelineUtils from '../../utils/timeline-utils'

import './styles.scss'

class Timeline extends BaseComponent {
  constructor(props) {
    super(props)

    this.actualTargetDate = null;
    this._isDraggingSelector = false;

    this.time_machine_actual_date_range = {
      from: moment(),
      to: moment()
    }

    this.dayInSec = 12 * 60 * 60
    this.chartPreviewData = []
    this._timelineUtils = new TimelineUtils(this.sharedState);
  }

  _formatXaxis(item) {
    return moment(item).format('MMM DD hh:mm A')
  }

  _setTargetDate(mouseX) {
    $('.main-chart .selector').attr(
      'transform',
      'translate(' + mouseX + ')'
    )

    if (this.mainChartElem) {
      const targetDate = this.mainChartElem.internal.x.invert(mouseX).toISOString()
      this.sharedState.set('time_machine_target_date', targetDate)
    }

  }

  _setupTimeMachineTargetDate()
  {
    if (this.actualTargetDate)
    {
      this._renderTimeMachineLine();
      this._updateTimeMachineSelectorLinePosition();

      this._renderTimeMachinePreviewLine();
      this._updateTimeMachinePreviewLinePosition();
    }
    else
    {
      this._removeTimeMachineLine();
      this._removeTimeMachinePreviewLine();
    }
  }

  _setupBrushSelectionRange(actual)
  {
    if (!this.brushChartElem) {
      return;
    }
    if (!actual.from || !actual.to) {
      return;
    }
    console.log('[_setupBrushSelectionRange] BEGIN');
    console.log('[_setupBrushSelectionRange] FROM: ', this.time_machine_actual_date_range.from.toISOString());
    console.log('[_setupBrushSelectionRange] TO: ', this.time_machine_actual_date_range.to.toISOString());
    setTimeout(() => {
      this.brushChartElem.zoom([actual.from, actual.to])
    })
    console.log('[_setupBrushSelectionRange] END');
  }

  _renderTimeMachineLine() {
    if (!this.mainChartElem) {
      return;
    }

    if (this.mainChartSelectorElem) {
      return;
    }
    const chartHeight = $('.main-chart .c3-event-rect').attr('height')

    const chartComponent = d3.select('.main-chart .c3-chart')
    const selector = chartComponent.append('g').attr('class', 'selector')
    selector.append('path').attr('d', 'M-7,0 h14 v20 l-7,7 l-7,-7 z')
    selector.append('path').attr('d', 'M0,15 v' + (chartHeight - 10)).attr('class', 'selector-line')

    selector.call(
      d3.drag()
      .on('start', () => {
        this._isDraggingSelector = true;
      })
      .on('drag', () => {
        this._setTargetDate(d3.event.x)
      })
      .on('end', () => {
        this._isDraggingSelector = false;
      })
    )

    this.mainChartSelectorElem = selector;
  }

  _removeTimeMachineLine()
  {
    if (this.mainChartSelectorElem) {
      this.mainChartSelectorElem.remove();
      this.mainChartSelectorElem = null;
    }
  }

  _updateTimeMachineSelectorLinePosition()
  {
    if (!this.mainChartElem) {
      return;
    }
    const targetDatePosition = this.mainChartElem.internal.x(moment(this.actualTargetDate))
    $('.main-chart .selector')
      .attr('display', 'block')
      .attr('transform','translate(' + targetDatePosition + ')')
  }

  _renderTimeMachinePreviewLine() {
    if (this.previewChartSelectorElem) {
      return;
    }

    const brushComponent = d3.select('#preview-chart .c3-brush')
      const brushSelector = brushComponent.append('g').attr('class', 'selector')
      brushSelector.append('path').attr('d', 'M0,0 v' + 30)

      this.previewChartSelectorElem = brushSelector;
  }

  _removeTimeMachinePreviewLine()
  {
    if (this.previewChartSelectorElem) {
      this.previewChartSelectorElem.remove();
      this.previewChartSelectorElem = null;
    }
  }

  _updateTimeMachinePreviewLinePosition()
  {
    if (!this.brushChartElem) {
      return;
    }
    if (!this.previewChartSelectorElem) {
      return;
    }

    const date = moment(this.actualTargetDate);
    const position = this.brushChartElem.internal.subX(date)
    this.previewChartSelectorElem.attr('transform','translate(' + position + ')')
  }

  _handleChartClick() {
    const self = this
    if (this.mainChartElem) {
      this.mainChartElem.internal.main.on('click', function () {
        self.sharedState.set('time_machine_enabled', true)
        self._setTargetDate(d3.mouse(this)[0])
      })
    }
  }

  _handleBrush(domain) {

    console.log("[_handleBrush] domain: ", domain)
    if (domain.length != 2) {
      return;
    }
    if (!_.every(domain, x => isValidDate(x))) {
      return;
    }

    let dates = _.map(domain, x => moment(x));
    dates = _.sortBy(dates);

    console.log("[_handleBrush] dates: ", dates)

    this.time_machine_actual_date_range = {
      from: dates[0],
      to: dates[1]
    }

    console.log("[_handleBrush] From: ", this.time_machine_actual_date_range.from.toISOString());
    console.log("[_handleBrush]   To: ", this.time_machine_actual_date_range.to.toISOString());

    this._activateMainChartRange();

    this._setupTimeMachineTargetDate();

    this._applyUIRangeChange();
  }

  _applyUIRangeChange()
  {
    let diff = moment.duration(this.time_machine_actual_date_range.to.diff(this.time_machine_actual_date_range.from));
    let durationSeconds = diff.asSeconds();
    console.log("[_handleBrush] durationSeconds: ", durationSeconds);

    let lastDate = this.sharedState.get('time_machine_timeline_preview_last_date');
    if (this.time_machine_actual_date_range.to.isSameOrAfter(lastDate))
    {
      this.sharedState.set('time_machine_date_to', null)
    }
    else
    {
      this.sharedState.set('time_machine_date_to', this.time_machine_actual_date_range.to.toISOString());
    }
    this.sharedState.set('time_machine_duration', durationSeconds)
  }

  _renderBrushChart() {
    this.brushChartElem = c3.generate({
      padding: {
        left: 100,
      },
      transition: {
        duration: null
      },
      bindto: '#preview-chart',
      data: {
        json: this._massageData(this.chartPreviewData),
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
          padding: {
            left: 0,
            right: 0
          }
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
  }

  _updateBrushChartData()
  {
    const brushChart = this.brushChartElem
    if (brushChart) {
      brushChart.load({
        json: this.chartPreviewData,
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
    this.mainChartElem = c3.generate({
      padding: {
        left: 100,
        right: 20,
      },
      transition: {
        duration: null
      },
      bindto: '.main-chart',
      data: {
        json: this._massageData(),
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

    this._updateMainChartData([]);
    this._renderHoverLine();
    this._renderTimeMachineLine();

    this._activateMainChartRange();

    this._handleChartClick()
  }

  _updateMainChartData(data)
  {
    if (this.mainChartElem) {
      this.mainChartElem.load({
        json: this._massageData(data),
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

  _massageData(data)
  {
    if (data)
    {
      if (data.length > 0)
      {
        return data;
      }
    }
    return [{
      dateMoment: moment(),
      error: 0,
      warn: 0,
      changes: 0
    }];
  }

  _renderHoverLine() {
    const vertical = d3
      .select('.main-chart .c3-chart')
      .append('g')
      .attr('class', 'hover-line')
      .append('path')
      .attr('pointer-events', 'none')

    this.verticalElem = vertical;

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

  _updateHoverLineHeight(chartHeight)
  {
    if (!this.verticalElem) {
      return;
    }

    const calculatedHeightDiff = chartHeight / 20
    this.verticalElem.attr('d', 'M0,' + (5 + calculatedHeightDiff) + ' v' + (chartHeight - 35 - calculatedHeightDiff));
  }

  _activateMainChartRange()
  {
    if (!this.mainChartElem) {
      return;
    }
    console.log('[_activateMainChartRange] FROM:', this.time_machine_actual_date_range.from);
    console.log('[_activateMainChartRange]   TO:', this.time_machine_actual_date_range.to);

    if (!this.time_machine_actual_date_range.from ||
        !this.time_machine_actual_date_range.to)
    {
      this.mainChartElem.axis.range({});
    }
    else
    {
      this.mainChartElem.axis.range({
        min: {
          x: this.time_machine_actual_date_range.from
        },
        max: {
          x: this.time_machine_actual_date_range.to
        }
      });

    }
  }

  _dateRangesAreSame(newActual)
  {
    return this._datesAreSame(this.time_machine_actual_date_range.from, newActual.from) &&
      this._datesAreSame(this.time_machine_actual_date_range.to, newActual.to);
  }

  _datesAreSame(oldDate, newDate)
  {
    if (oldDate) {
      return oldDate.isSame(newDate);
    }
    return false;
  }

  componentDidMount() {

    this._renderMainChart()
    this._renderBrushChart()

    this.subscribeToSharedState(
      [
        'time_machine_actual_date_from',
        'time_machine_actual_date_to'
      ],
      () => {

        let actual = this._timelineUtils.getActualRange();

        console.log("[subscribeToSharedState] CURR From: ", this.time_machine_actual_date_range.from.toISOString());
        console.log("[subscribeToSharedState] CURR  To: ", this.time_machine_actual_date_range.to.toISOString());

        console.log("[subscribeToSharedState] From: ", actual.from.toISOString());
        console.log("[subscribeToSharedState]   To: ", actual.to.toISOString());

        if (this._dateRangesAreSame(actual)) {
          return;
        }

        this.time_machine_actual_date_range = actual;

        this._setupBrushSelectionRange(this.time_machine_actual_date_range);
        this._setupTimeMachineTargetDate();
      }
    );

    this.subscribeToSharedState(
      [
        'time_machine_enabled',
        'time_machine_target_date'
      ],
      ({
        time_machine_enabled,
        time_machine_target_date
      }) => {

        this.actualTargetDate = moment(time_machine_target_date).toISOString();

        if (!time_machine_enabled || !time_machine_target_date) {
          this.actualTargetDate = null;
        }

        this._setupTimeMachineTargetDate();
      }
    );

    this.subscribeToSharedState('time_machine_timeline_data',
      (time_machine_timeline_data) => {
        this._updateMainChartData(time_machine_timeline_data);
        this._setupTimeMachineTargetDate()
    });

    this.subscribeToSharedState('time_machine_timeline_preview',
      (time_machine_timeline_preview) => {
        this.chartPreviewData = this._massageData(time_machine_timeline_preview);
        this._updateBrushChartData()
        this._setupTimeMachineTargetDate()
    });

    $(document).on('layout-resize-timelineComponent', () => {
      const mainChartheight = $('.chart-view').height() - 50
      const mainChartwidth = $('.chart-view').width()
      this._updateHoverLineHeight(mainChartheight)
      if (this.mainChartElem) {
        this.mainChartElem.resize({ height: mainChartheight, width: mainChartwidth })
      }
      const brushChart = this.brushChartElem
      if (brushChart) {
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
          <div id="preview-chart"></div>
        </div>
        <TimelineButtons />
      </div>
    )
  }
}

function isValidDate(date)
{
  if (!date) {
    return false;
  }
  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    if (isNaN(date.getTime())) {  // d.valueOf() could also work
      return false
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export default Timeline
