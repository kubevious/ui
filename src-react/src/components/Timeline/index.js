import React, { Component, Fragment } from 'react'
import * as d3 from 'd3'
import $ from 'jquery'
import { formatDate } from '../../utils/ui-utils'
import moment from 'moment'

import './styles.css'

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.sharedState = this.props.sharedState;

        this._parentElem = null;
        this._showAxis = false;

        this.resetView();
    }

    get isTimeMachineEnabled() {
        return this.sharedState.get('time_machine_enabled');
    }

    get timeMachineDate() {
        return this.sharedState.get('time_machine_target_date');
    }

    get actualDateFrom() {
        return this.sharedState.get('time_machine_actual_date_from');
    }

    get actualDateTo() {
        return this.sharedState.get('time_machine_actual_date_to');
    }

    get dateFrom() {
        return this.sharedState.get('time_machine_date_from');
    }

    get dateTo() {
        return this.sharedState.get('time_machine_date_to');
    }

    get durationHrs() {
        return this.sharedState.get('time_machine_duration');
    }

    get timelineData()
    {
        var data = this.sharedState.get('time_machine_timeline_data');
        if (!data) {
            return [];
        }
        return data;
    }

    resetView() {
        this.sharedState.set('time_machine_date_to', new Date());
        this.sharedState.set('time_machine_duration', 24);
        this.sharedState.set('time_machine_enabled', false);
        this.sharedState.set('time_machine_date', null);
        this.sharedState.set('time_machine_target_date', null);
        this._handlePanZoom();
    }

    zoomIn() {
        this.sharedState.set('time_machine_duration', Math.max(1, this.durationHrs / 2));
        this._handlePanZoom();
    }

    zoomOut() {
        this.sharedState.set('time_machine_duration', Math.max(1, this.durationHrs * 2));
        this._handlePanZoom();
    }

    panLeft() {
        this.sharedState.set('time_machine_date_to', this._calcShiftDate(-this.durationHrs / 2));
        this._handlePanZoom();
    }

    panRight() {
        this.sharedState.set('time_machine_date_to', this._calcShiftDate(this.durationHrs / 2));
        this._handlePanZoom();
    }

    _handlePanZoom()
    {
        this.sharedState.set('time_machine_date_from', this._calcShiftDate(-this.durationHrs));
        if (this.isTimeMachineEnabled)
        {
            if (this.timeMachineDate < this.dateFrom) {
                this.sharedState.set('time_machine_target_date', this.dateFrom);
            }
            if (this.timeMachineDate > this.dateTo) {
                this.sharedState.set('time_machine_target_date', this.dateTo);
            }
        }
    }

    _calcShiftDate(diffHours) {
        return moment(this.dateTo).add(diffHours, 'hours').toDate();
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

        $(document).on('layout-resize-timelineComponent', () => {
            this._setupDimentions();
        });

        this._setupDimentions();
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
        this._xScale = d3
            .scaleTime()
            .domain([
                this.actualDateFrom,
                this.actualDateTo
            ])
            .range([0, this._width]);
        this._yScaleItems = d3
            .scaleLinear()
            .domain(d3.extent(this.timelineData, function (d) {
                return d.items;
            }))
            .range([this._height, 0]);
        this._yScaleAlerts = d3
            .scaleLinear()
            .domain(d3.extent(this.timelineData, function (d) {
                return d.alerts;
            }))
            .range([this._height, 0])
        ;
    }

    _renderCharts() {
        // Create & append area chart
        {
            const alerts = d3.area()
                .x((d) => {
                    return this._xScale(d.date);
                })
                .y0(this._height)
                .y1((d) => {
                    return this._yScaleAlerts(d.alerts);
                });
            this._renderChart(alerts, 'alerts');
        }

        // Create & append line chart
        {
            const items = d3.line()
                .x((d) => {
                    return this._xScale(d.date);
                })
                .y((d) => {
                    return this._yScaleItems(d.items);
                });

            this._renderChart(items, 'changes');
        }
    }

    _renderAxis() {
        this._axisElem.html('');

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
                    .axisLeft(this._yScaleItems)
                    .ticks(verticalTickCount));

            this._axisElem
                .append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + this._width + ', 0)')
                .call(d3
                    .axisRight(this._yScaleAlerts)
                    .ticks(verticalTickCount));
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

        var selectorPositionX = this._xScale(this.timeMachineDate);
        if (selectorPositionX < 0) {
            selectorPositionX = 0;
        }
        if (selectorPositionX > this._width) {
            selectorPositionX = this._width;
        }
        this._selectorElem.attr('transform', 'translate(' + selectorPositionX + ')');
    }

    _renderChart(chartObj, chartClass) {
        const charts = this._chartsElem.selectAll('.' + chartClass)
            .data([this.timelineData])
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

    _selectorDragged() {
        var date = new Date(this._xScale.invert(d3.event.x));
        if (date < this.actualDateFrom) {
            date = this.actualDateFrom
        }
        if (date > this.actualDateTo) {
            date = this.actualDateTo
        }
        this.sharedState.set('time_machine_target_date', date)
    }

    toggleTimeMachine() {
        this.sharedState.set('time_machine_enabled', !this.sharedState.get('time_machine_enabled'));
        if (this.sharedState.get('time_machine_enabled'))
        {
            this.sharedState.set('time_machine_target_date', this.sharedState.get('time_machine_date_to'));
            this.sharedState.set('time_machine_date', this.sharedState.get('time_machine_date_to'));
        }
        else
        {
            this.sharedState.set('time_machine_target_date', null);
            this.sharedState.set('time_machine_date', null);
        }
    }

    _cancelPendingTimeouts() {
        if (this._dateChangeTimerId) {
            clearTimeout(this._dateChangeTimerId);
            this._dateChangeTimerId = null;
        }
    }

    componentDidMount() {
        this._parentElem = d3.select('#timeline')
        this._setup()

        this.sharedState.subscribe('time_machine_enabled',
            ( time_machine_enabled ) => {

                if (time_machine_enabled) {
                    $('#btnTimelineTimeMachine').addClass('active');
                } else {
                    $('#btnTimelineTimeMachine').removeClass('active');
                }
            });

        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_target_date'],
            ({ time_machine_enabled, time_machine_target_date }) => {
                var html = '';
                if (time_machine_enabled && time_machine_target_date) {
                    html = '<span>Time Machine Active: ' + formatDate(time_machine_target_date) + '</span>';
                }
                $('.history-info').html(html);
            });

        this.sharedState.subscribe(['time_machine_enabled', 'time_machine_target_date'],
            () => {
                this._renderSelector();
            });

        this.sharedState.subscribe(['time_machine_timeline_data', 'time_machine_actual_date_from', 'time_machine_actual_date_to'],
            () => {
                this._renderTimeline();
            });

        this.sharedState.subscribe('time_machine_target_date',
            ( time_machine_target_date ) => {
                this._cancelPendingTimeouts();

                if (!time_machine_target_date) {
                    this.sharedState.set('time_machine_date', null);
                } else {

                    this._dateChangeTimerId = setTimeout(() => {
                        this._cancelPendingTimeouts();

                        this.sharedState.set('time_machine_date', time_machine_target_date);

                    }, 250);


                }
            });

        $('#btnTimelineTimeMachine').on('click', () => this.toggleTimeMachine())
        $('.reset').on('click', () => this.resetView())
        $('.plus').on('click', () => this.zoomIn())
        $('.minus').on('click', () => this.zoomOut())
        $('.left').on('click', () => this.panLeft())
        $('.right').on('click', () => this.panRight())
    }

    render() {
        return (
            <Fragment>
                <div id="timeline" className="timeline size-to-parent"/>
                <div className="tl-actions">
                    <a role="button" className="reset"/>
                    <a role="button" id="btnTimelineTimeMachine" className="timemachine"/>
                    <a role="button" className="plus"/>
                    <a role="button" className="minus"/>
                    <a role="button" className="left"/>
                    <a role="button" className="right"/>
                </div>
            </Fragment>
        )
    }
}

export default Timeline
