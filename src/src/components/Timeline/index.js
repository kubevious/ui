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

    this.actualTargetDate = null;
    this._isDraggingSelector = false;

    this.time_machine_actual_date_range = {
      from: moment(),
      to: moment()
    }

    this.dayInSec = 12 * 60 * 60
    this.chartPreviewData = []
    this._timelineUtils = new TimelineUtils(this.sharedState);
    this._parentElem = null;
    this._showAxis = false;
  }

  zoomIn() {
    this.sharedState.set('time_machine_duration', Math.max(1, this.durationSeconds / 2));
}

  zoomOut() {
    this.sharedState.set('time_machine_duration', Math.max(1, this.durationSeconds * 2));
}

panLeft() {
    this.sharedState.set('time_machine_date_to', this._calcShiftDate(-this.durationSeconds / 2));
}

panRight() {
    this.sharedState.set('time_machine_date_to', this._calcShiftDate(this.durationSeconds / 2));
}

_calcShiftDate(diffSeconds) {
    return moment(this.time_machine_actual_date_range.to).add(diffSeconds, 'seconds').toISOString();
}

_setup() {
    this._svgElem = this._parentElem
        .insert('svg', ':first-child')
        .attr('position', 'absolute')
        .attr('overflow', 'hidden')
        .attr('top', 0)
        .attr('left', 0)
        .attr('right', 0)
        .attr('bottom', 0)
        .attr('width', '100%')
        .attr('height', '100%')

    this._axisElem = this._svgElem
        .append('g')
        .attr('class', 'axis')

    this._chartsElem = this._svgElem
        .append('g')
        .attr('class', 'charts')

    this._selectorElem = this._svgElem
        .append('g')
        .attr('class', 'selector')
    this._selectorElem
        .call(
            d3.drag().on('drag', this._selectorDragged.bind(this))
    );

    this._brushElem = this._svgElem
      .append("g")
      .classed("sub", true)
    this._brush = d3.brushX(this._subXScale).on("brush", this._onBrushChange)

    $(document).on('layout-resize-timelineComponent', () => {
        this._setupDimentions();
    });

    this._setupDimentions();
}

_onBrushChange() {
  const domain = this._brush.empty() ? this._subXScale.domain() : this._brush.extent();
  // activateRangeInMainChart(domain[0], domain[1]);
}

_setupDimentions(size) {
    if (!size) {
        size = this._parentElem.node().getBoundingClientRect();
    }

    var margin = this._getMargin();

    this._width = size.width - margin.left - margin.right;
    this._height = size.height - margin.top - margin.bottom;

    var viewBox = [
        (-margin.left),
        (-margin.top),
        (this._width + margin.left + margin.right),
        (this._height + margin.top + margin.bottom)
    ]
    this._svgElem
        .attr('viewBox', viewBox.join(' '));

    this._renderTimeline();
}

_getMargin() {
    var margin = {
        top: 10,
        right: 15,
        bottom: 25,
        left: 15
    };

    if (this._showAxis) {
        margin.left += 40;
        margin.lerightft += 40;
    }

    return margin;
}

_renderTimeline() {
    this._setupScales();

    this._renderCharts();

    this._renderAxis();

    this._renderSelector();
}

  _setupScales() {
    if (this.chartData && this.time_machine_actual_date_range.from && this.time_machine_actual_date_range.to) {
    this._xScale = d3
        .scaleTime()
        .domain([
          this.time_machine_actual_date_range.to.clone().subtract('12', 'hours'),
          this.time_machine_actual_date_range.to
        ])
        .range([0, this._width]);
    this._yScaleChanges = d3
        .scaleLinear()
        .domain(d3.extent(this.chartData, function (d) {
            return d.changes;
        }))
        .range([this._height, 0]);
    this._yScaleWarnings = d3
        .scaleLinear()
        .domain(d3.extent(this.chartData, function (d) {
            return d.warn;
        }))
        .range([this._height, 0]);
    this._yScaleErrors = d3
        .scaleLinear()
        .domain(d3.extent(this.chartData, function (d) {
            return d.error;
        }))
        .range([this._height, 0]);
    }
    this._subXScale = d3
      .scaleTime()
      .range([0, this._width])
    this._subYScale = d3
      .scaleLinear()
      .range([this._height, 0])
}

_renderCharts() {
    if (this.chartData) {
    {
        const warnings = d3.area()
          .x((d) => {
                return this._xScale(d.dateMoment);
            })
            .y0(this._height)
            .y1((d) => {
                return this._yScaleWarnings(d.warn);
            });
        this._renderChart(warnings, 'warnings');
    }

    {
        const changes = d3.line()
          .x((d) => {
              return this._xScale(d.dateMoment);
            })
          .y((d) => {
              return this._yScaleChanges(d.changes);
            });

        this._renderChart(changes, 'changes');
      }
    }

    {
      const errors = d3.area()
        .x((d) => {
              return this._xScale(d.dateMoment);
          })
          .y0(this._height)
          .y1((d) => {
              return this._yScaleErrors(d.error);
          });
      this._renderChart(errors, 'errors');
  }
}

_renderAxis() {
    this._axisElem.html('');
  if (this.chartData) {
    var horizontalTickCount = Math.max(1, this._width / 200);
    this._axisElem
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + this._height + ')')
        .call(d3
            .axisBottom(this._xScale)
          .tickFormat(function (d) {
                return formatDate(d);
            })
            .ticks(horizontalTickCount)
        );

    if (this._showAxis) {
        var verticalTickCount = Math.max(1, this._height / 20);
        this._axisElem
            .append('g')
            .attr('class', 'y axis')
            .call(d3
                .axisLeft(this._yScaleChanges)
                .ticks(verticalTickCount));

        this._axisElem
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(' + this._width + ', 0)')
            .call(d3
                .axisRight(this._yScaleWarnings)
              .ticks(verticalTickCount));

        this._axisElem
              .append('g')
              .attr('class', 'y axis')
              .attr('transform', 'translate(' + this._width + ', 0)')
              .call(d3
                  .axisRight(this._yScaleErrors)
                  .ticks(verticalTickCount));
    }

    this._subXAxis = d3.axisBottom(this._subXScale)
    this._subYAxis = d3.axisLeft(this._subYScale)
  }
}

_renderSelector() {
    this._selectorElem.html('');

    if (!this.isTimeMachineEnabled) {
        return;
    }

    var margin = this._getMargin();
    this._selectorElem
        .append('path')
        .attr('d', 'M-7,' + (-0.4 * margin.top) + ' h14 v20 l-7,7 l-7,-7 z');
    this._selectorElem
        .append('path')
        .attr('d', 'M0,' + (-0.4 * margin.top) + ' v' + (this._height + margin.top * 0.7));

    var selectorPositionX = this._xScale(this.actualTargetDate);
    if (selectorPositionX < 0) {
        selectorPositionX = 0;
    }
    if (selectorPositionX > this._width) {
        selectorPositionX = this._width;
    }
    this._selectorElem.attr('transform', 'translate(' + selectorPositionX + ')');
}

  _renderChart(chartObj, chartClass) {
    if (this.chartData) {
      const stack = d3.stack().keys(['error', 'warn'])
      const stackedData = stack(this.chartData)
    const charts = this._chartsElem.selectAll('.' + chartClass)
        .data([this.chartData])
        .attr('class', chartClass);

    charts.exit()
        .remove();

    charts.enter()
        .append('path')
        .attr('class', chartClass)
        .attr('d', chartObj)
        .merge(charts)
        .attr('d', chartObj)
      }
  }

  _renderSubchart() {
    this._brushElemPath = this._brushElem.append("path")

    this._brushElem
        .append("g")
        .classed("x axis", true)
        .attr("transform", "translate(0, " + this._height + ")")
        .call(this._subXAxis);
    this._brushElem
        .append("g")
        .classed("y axis", true)
        .attr("transform", "translate(0, 0)")
        .call(this._subYAxis);


    // this._brushElemPath.datum(data).classed("area", true).attr("d", subArea);

    this._brushElem
        .append("g")
        .classed("x brush", true)
        .call(this._brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", this._height + 7);
  }

_selectorDragged() {
    var date = new Date(this._xScale.invert(d3.event.x));
    if (date < this.this.time_machine_actual_date_range.from) {
        date = this.this.time_machine_actual_date_range.from
    }
    if (date > this.this.time_machine_actual_date_range.to) {
        date = this.this.time_machine_actual_date_range.to
    }
    this.sharedState.set('time_machine_target_date', date)
}

_cancelPendingTimeouts() {
    if (this._dateChangeTimerId) {
        clearTimeout(this._dateChangeTimerId);
        this._dateChangeTimerId = null;
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

  _setupTimeMachineTargetDate()
  {
    // if (this.actualTargetDate)
    // {
    //   this._renderTimeMachineLine();
    //   this._updateTimeMachineSelectorLinePosition();

    //   this._renderTimeMachinePreviewLine();
    //   this._updateTimeMachinePreviewLinePosition();
    // }
    // else
    // {
    //   this._removeTimeMachineLine();
    //   this._removeTimeMachinePreviewLine();
    // }
  }

  _setupBrushSelectionRange(actual)
  {
    // this.mainXScale.domain([this.from, this.to]);
    // this.main.select(".area").attr("d", this.mainArea);
    // this.main.select(".x.axis").call(this.mainXAxis);
    // this._refreshMainData(this.from, this.to);
  }

  _renderTimeMachineLine() {
    // if (!this.mainChartElem) {
    //   return;
    // }

    // if (this.mainChartSelectorElem) {
    //   return;
    // }
    // const chartHeight = $('.main-chart .c3-event-rect').attr('height')

    // const chartComponent = d3.select('.main-chart .c3-chart')
    // const selector = chartComponent.append('g').attr('class', 'selector')
    // selector.append('path').attr('d', 'M-7,0 h14 v20 l-7,7 l-7,-7 z')
    // selector.append('path').attr('d', 'M0,15 v' + (chartHeight - 10)).attr('class', 'selector-line')

    // selector.call(
    //   d3.drag()
    //   .on('start', () => {
    //     this._isDraggingSelector = true;
    //   })
    //   .on('drag', () => {
    //     this._setTargetDate(d3.event.x)
    //   })
    //   .on('end', () => {
    //     this._isDraggingSelector = false;
    //   })
    // )

    // this.mainChartSelectorElem = selector;
  }

  _removeTimeMachineLine()
  {
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

  _renderTimeMachinePreviewLine() {
    // if (this.previewChartSelectorElem) {
    //   return;
    // }

    // const brushComponent = d3.select('#preview-chart .c3-brush')
    //   const brushSelector = brushComponent.append('g').attr('class', 'selector')
    //   brushSelector.append('path').attr('d', 'M0,0 v' + 30)

    //   this.previewChartSelectorElem = brushSelector;
  }

  _removeTimeMachinePreviewLine()
  {
    // if (this.previewChartSelectorElem) {
    //   this.previewChartSelectorElem.remove();
    //   this.previewChartSelectorElem = null;
    // }
  }

  _updateTimeMachinePreviewLinePosition()
  {
    // if (!this.brushChartElem) {
    //   return;
    // }
    // if (!this.previewChartSelectorElem) {
    //   return;
    // }

    // const date = moment(this.actualTargetDate);
    // const position = this.brushChartElem.internal.subX(date)
    // this.previewChartSelectorElem.attr('transform','translate(' + position + ')')
  }

  _handleChartClick() {
    // const self = this
    // if (this.mainChartElem) {
    //   this.mainChartElem.internal.main.on('click', function () {
    //     self.sharedState.set('time_machine_enabled', true)
    //     self._setTargetDate(d3.mouse(this)[0])
    //   })
    // }
  }

  _handleBrush() {

    // const domain = this.brush.empty() ? this.subXScale.domain() : this.brush.extent();
    // this._activateRangeInMainChart(domain[0], domain[1]);

    // this._activateMainChartRange();

    // this._setupTimeMachineTargetDate();

    // this._applyUIRangeChange();
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

    this._parentElem = d3.select('.chart-view')
    this._setup()

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

        let diff = moment.duration(actual.to.diff(actual.from));
        this.durationSeconds = diff.asSeconds();

        this.time_machine_actual_date_range = actual;

        // this._setupBrushSelectionRange(this.time_machine_actual_date_range);
        // this._setupTimeMachineTargetDate();
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
        this._renderSelector()
        // this._setupTimeMachineTargetDate();
      }
    );

    this.subscribeToSharedState('time_machine_timeline_data',
      (time_machine_timeline_data) => {
        this.chartData = time_machine_timeline_data
        // this._updateMainChartData(time_machine_timeline_data);
        // this._setupTimeMachineTargetDate()
        this._renderTimeline()
    });

    this.subscribeToSharedState('time_machine_timeline_preview',
      (time_machine_timeline_preview) => {
        this.chartPreviewData = this._massageData(time_machine_timeline_preview);
        // this._updateBrushChartData()
        // this._setupTimeMachineTargetDate()
    });

    $('.plus').on('click', () => this.zoomIn())
    $('.minus').on('click', () => this.zoomOut())
    $('.left').on('click', () => this.panLeft())
    $('.right').on('click', () => this.panRight())

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
