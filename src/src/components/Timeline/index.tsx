import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"
import $ from "jquery"
import _ from "the-lodash"
import moment, { DurationInputArg1 } from "moment"
import { formatDate } from "../../utils/ui-utils"
import * as d3 from "d3"
import { TimelineButtons } from "../TimelineButtons"
import { TimelineUtils } from "../../utils/timeline-utils"

import "./styles.scss"
import { Actual, ChartData } from "./type"

export class Timeline extends ClassComponent {
    actualTargetDate!: string | null
    time_machine_actual_date_range: Actual
    chartPreviewData: ChartData[]
    private _timelineUtils: TimelineUtils
    private _showAxis: boolean

    // d3 elements
    //
    private _parentElem: any // Selection<BaseType, unknown, HTMLElement, any>
    private _mainSvgElem: any
    private _mainChartElem: any
    private _axisElem: any
    private _chartsElem: any
    private _selectorElem: any
    private _hoverLineElem: any
    private _tooltipElem: any
    private _subSvgElem: any
    private _subchartAxisElem: any
    private _subElemCharts: any
    private _subchartSelectorElem: any
    //

    private _width!: number
    wrap: boolean = false
    chartData!: ChartData[]
    private _xScale!: d3.ScaleTime<number, number, never>
    private _yScaleChanges!: number[] & d3.ScaleLinear<number, number, never>
    private _yScaleErrorsWarnings!: number[] &
        d3.ScaleLinear<number, number, never>
    private _subXScale!: d3.ScaleTime<number, number, never>
    private _subYScaleChanges!: d3.ScaleLinear<number, number, never>
    private _subYScaleErrorsWarnings!: number[] &
        d3.ScaleLinear<number, number, never>
    private _subXAxis!: d3.Axis<d3.AxisDomain>
    private _subYAxisChanges!: d3.Axis<d3.AxisDomain>
    private _brush!: d3.BrushBehavior<unknown>
    private _movingTheBrush: boolean = false
    isTimeMachineActive: boolean = false
    durationSeconds!: number
    dayInSec: DurationInputArg1
    private _height!: number
    constructor(props) {
        super(props)

        this.time_machine_actual_date_range = {
            from: moment().subtract(this.dayInSec, "seconds"),
        }

        this.dayInSec = 12 * 60 * 60
        this.chartPreviewData = []
        this._timelineUtils = new TimelineUtils(this.sharedState)
        this._parentElem = null
        this._showAxis = false
    }

    _setup() {
        this._mainSvgElem = this._parentElem
            .insert("svg", ":first-child")
            .attr("position", "absolute")
            .attr("overflow", "hidden")
            .attr("top", 0)
            .attr("left", 0)
            .attr("right", 0)
            .attr("bottom", 0)
            .attr("width", "100%")
            .attr("height", "calc(100% - 50px)")

        this._mainChartElem = this._mainSvgElem
            .append("g")
            .attr("class", "main-chart")
            .attr("transform", "translate(0, 0)")
            .attr("height", "100%")

        this._axisElem = this._mainChartElem.append("g").attr("class", "axis")

        this._chartsElem = this._mainChartElem
            .append("g")
            .attr("class", "charts")

        this._chartsElem.on("click", this._onUserChartClick.bind(this))

        this._selectorElem = this._mainChartElem
            .append("g")
            .attr("class", "selector")
            .call(d3.drag().on("drag", this._onUserDragSelector.bind(this)))

        this._hoverLineElem = this._mainChartElem
            .append("g")
            .attr("class", "hover-line")
            .append("path")
            .attr("pointer-events", "none")

        this._tooltipElem = this._parentElem
            .append("div")
            .attr("class", "custom-tooltip")

        this._subSvgElem = this._parentElem
            .insert("svg")
            .attr("position", "absolute")
            .attr("overflow", "hidden")
            .attr("top", 0)
            .attr("left", 0)
            .attr("right", 0)
            .attr("bottom", 0)
            .attr("width", "100%")
            .attr("height", "50px")

        this._subchartAxisElem = this._subSvgElem
            .append("g")
            .attr("class", "subchart-axis")

        this._subElemCharts = this._subSvgElem
            .append("g")
            .attr("class", "brush-charts")

        $(document).on("layout-resize-timelineComponent", () => {
            this._setupDimentions()
            this._updateHoverLineHeight()
        })

        this._setupDimentions()
    }

    _setupDimentions(size?: { width: number; height: number }): void {
        if (!size) {
            if (this._parentElem.node()) {
                size = this._parentElem.node().getBoundingClientRect()
            } else {
                return
            }
        }

        if (size) {
            const margin = this._getMargin()

            this._width = size.width - margin.left - margin.right
            this._height = size.height - margin.top - margin.bottom - 40
            this.wrap = this._height > 150

            const viewBox = [
                -margin.left,
                0,
                this._width + margin.left + margin.right,
                this._height +
                    margin.top +
                    margin.bottom -
                    10 -
                    this._height / 65,
            ]
            this._applyViewBox(this._mainSvgElem, viewBox)

            const subViewBox = [
                -margin.left,
                0,
                this._width + margin.left + margin.right,
                50,
            ]
            this._applyViewBox(this._subSvgElem, subViewBox)

            this._renderTimelineMain()
            this._renderTimelineSub()
        }
    }

    _applyViewBox(elem: any, viewBox: number[]): void {
        const myViewBox = _.clone(viewBox)
        myViewBox[2] = Math.max(0, myViewBox[2])
        myViewBox[3] = Math.max(0, myViewBox[3])
        elem.attr("viewBox", myViewBox.join(" "))
    }

    _getMargin() {
        const margin = {
            top: 10,
            right: 15,
            bottom: 25,
            left: 15,
            lerightft: 0,
        }

        if (this._showAxis) {
            margin.left += 40
            margin.lerightft += 40
        }

        return margin
    }

    _renderTimelineMain(): void {
        if (this.chartData) {
            this._setupChartScales()

            this._renderCharts()

            this._renderAxis()

            this._renderSelector()

            this._updateSelectorPosition()

            this._renderHoverLine()
        }
    }

    _renderTimelineSub(): void {
        if (this.chartPreviewData) {
            this._setupSubChartScales()

            this._renderSubchartAxis()

            this._renderSubCharts()

            this._calculateBrushInit()

            this._renderSubchartSelector()

            if (this.actualTargetDate) {
                this._updateSubchartSelectorPosition()
            }
        }
    }

    _setupChartScales(): void {
        this._xScale = d3.scaleTime().range([0, this._width])
        this._yScaleChanges = d3
            .scaleLinear()
            // @ts-ignore: Unreachable code error
            .domain([
                0,
                d3.max(this.chartData, function (d) {
                    return d.changes
                }),
            ])
            .range([this._height, 0])
        this._yScaleErrorsWarnings = d3
            .scaleLinear()
            // @ts-ignore: Unreachable code error
            .domain([
                0,
                d3.max(this.chartData, function (d) {
                    return d.error + d.warn
                }),
            ])
            .range([this._height, 0])

        this._activateMainChartDomain()
    }

    _setupSubChartScales(): void {
        const head = this.chartPreviewData[0]
        const last = this.chartPreviewData[this.chartPreviewData.length - 1]
        this._subXScale = d3
            .scaleTime()
            .domain([
                head ? head.dateMoment : moment().subtract("5", "days"),
                last ? last.dateMoment : moment(),
            ])
            .range([0, this._width])
        this._subYScaleChanges = d3
            .scaleLinear()
            // @ts-ignore: Unreachable code error
            .domain([
                0,
                d3.max(this.chartPreviewData, function (d) {
                    return d.changes
                }),
            ])
            .range([30, 0])
        this._subYScaleErrorsWarnings = d3
            .scaleLinear()
            // @ts-ignore: Unreachable code error
            .domain([
                0,
                d3.max(this.chartPreviewData, function (d) {
                    return d.error + d.warn
                }),
            ])
            .range([30, 0])

        this._renderSubchartAxis()
    }

    _renderCharts(): void {
        {
            const errors = d3
                .area()
                .x((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._xScale(d.dateMoment)
                })
                .y0((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._yScaleErrorsWarnings(d.warn)
                })
                .y1((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._yScaleErrorsWarnings(d.error + d.warn)
                })
            this._renderChart(errors, "errors")
        }

        {
            const warnings = d3
                .area()
                .x((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._xScale(d.dateMoment)
                })
                .y0(() => {
                    return this._yScaleErrorsWarnings(0)
                })
                .y1((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._yScaleErrorsWarnings(d.warn)
                })
            this._renderChart(warnings, "warnings")
        }

        {
            const changes = d3
                .line()
                .x((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._xScale(d.dateMoment)
                })
                .y((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._yScaleChanges(d.changes)
                })

            this._renderChart(changes, "changes")
        }
    }

    _renderSubCharts(): void {
        {
            const brushErrors = d3
                .area()
                .x((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._subXScale(d.dateMoment)
                })
                .y0((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._subYScaleErrorsWarnings(d.warn)
                })
                .y1((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._subYScaleErrorsWarnings(d.error + d.warn)
                })
            this._renderSubchart(brushErrors, "errors")
        }

        {
            const brushWarnings = d3
                .area()
                .x((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._subXScale(d.dateMoment)
                })
                .y0(30)
                .y1((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._subYScaleErrorsWarnings(d.warn)
                })
            this._renderSubchart(brushWarnings, "warnings")
        }

        {
            const brushChanges = d3
                .line()
                .x((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._subXScale(d.dateMoment)
                })
                .y((d) => {
                    // @ts-ignore: Unreachable code error
                    return this._subYScaleChanges(d.changes)
                })

            this._renderSubchart(brushChanges, "changes")
        }

        this._renderSubchartBrush()
    }

    _renderAxis(): void {
        this._axisElem.html("")

        const horizontalTickCount = Math.max(1, this._width / 200)
        this._axisElem
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + this._height + ")")
            .call(
                d3
                    .axisBottom(this._xScale)
                    .tickFormat(function (d) {
                        return formatDate(d)
                    })
                    .ticks(horizontalTickCount)
            )

        if (this._showAxis) {
            const verticalTickCount = Math.max(1, this._height / 20)
            this._axisElem
                .append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(this._yScaleChanges).ticks(verticalTickCount))

            this._axisElem
                .append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + this._width + ", 0)")
                .call(
                    d3
                        .axisRight(this._yScaleErrorsWarnings)
                        .ticks(verticalTickCount)
                )
        }
    }

    _renderSubchartAxis(): void {
        // @ts-ignore: Unreachable code error
        this._subXAxis = d3.axisBottom(this._subXScale)
        // @ts-ignore: Unreachable code error
        this._subYAxisChanges = d3.axisLeft(this._subYScaleChanges)
        this._subchartAxisElem.html("")

        this._subchartAxisElem
            .append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0, " + 30 + ")")
            .call(this._subXAxis)

        if (this._showAxis) {
            this._subchartAxisElem
                .append("g")
                .classed("y axis", true)
                .attr("transform", "translate(0, 0)")
                .call(this._subYAxisChanges)
        }
        this._renderSubCharts()
    }

    _renderSubchartBrush(): void {
        $(".x-brush").detach()

        const self = this
        // @ts-ignore: Unreachable code error
        this._brush = d3.brushX(this._subXScale).on("brush end", function () {
            // @ts-ignore: Unreachable code error
            if (!d3.event.selection && d3.event.sourceEvent) {
                self._calculateBrushInit()
                return
            }
            self._onUserBrushMove(this)
        })

        this._subSvgElem
            .insert("g", ".sub-selector")
            .classed("x-brush", true)
            .call(this._brush)
            .selectAll("rect")
            .attr("y", 0)
            .attr("height", 30)
    }

    _calculateBrushInit(): void {
        if (!this._brush) {
            return
        }
        const startPos = this._subXScale(
            this.time_machine_actual_date_range.from
        )
        const endPos = this.time_machine_actual_date_range.to
            ? this._subXScale(this.time_machine_actual_date_range.to)
            : 0
        if (startPos > 0 && endPos > 0 && startPos !== endPos) {
            this._movingTheBrush = true
            // @ts-ignore: Unreachable code error
            d3.select(".x-brush").call(this._brush.move, [startPos, endPos])
            this._movingTheBrush = false
        } else if (endPos > 0 && startPos !== endPos) {
            this._movingTheBrush = true
            // @ts-ignore: Unreachable code error
            d3.select(".x-brush").call(this._brush.move, [0, this._width])
            this._movingTheBrush = false
        } else {
            this._movingTheBrush = true
            // @ts-ignore: Unreachable code error
            d3.select(".x-brush").call(this._brush.move, null)
            this._movingTheBrush = false
        }
    }

    // self: Timeline
    _onUserBrushMove(self: any): void {
        if (this._movingTheBrush) {
            return
        }

        if (d3.brushSelection(self)) {
            const dateTo = moment(
                // @ts-ignore: Unreachable code error
                this._subXScale.invert(d3.brushSelection(self)[1])
            )
            const dateFrom = moment(
                // @ts-ignore: Unreachable code error
                this._subXScale.invert(d3.brushSelection(self)[0])
            )
            if (dateTo.isSame(dateFrom)) {
                return
            }
            this.time_machine_actual_date_range = {
                from: dateFrom,
                to: dateTo,
            }
        }
        this._activateMainChartDomain()
        this._applyUIRangeChange()
    }

    _applyUIRangeChange(): void {
        if (
            !this.time_machine_actual_date_range.to ||
            !this.time_machine_actual_date_range.from
        ) {
            return
        }

        let diff = moment.duration(
            this.time_machine_actual_date_range.to.diff(
                this.time_machine_actual_date_range.from
            )
        )
        let durationSeconds = diff.asSeconds().toFixed()
        let lastDate = this.sharedState.get(
            "time_machine_timeline_preview_last_date"
        )
        if (this.time_machine_actual_date_range.to.isSameOrAfter(lastDate)) {
            this.sharedState.set("time_machine_date_to", null)
        } else {
            this.sharedState.set(
                "time_machine_date_to",
                this.time_machine_actual_date_range.to.toISOString()
            )
        }
        this.sharedState.set("time_machine_duration", durationSeconds)
    }

    _renderSelector(): void {
        this._selectorElem.html("")

        if (!this.actualTargetDate) {
            return
        }

        const margin = this._getMargin()
        this._selectorElem
            .append("path")
            .attr("d", "M-7," + -0.4 * margin.top + " h14 v20 l-7,7 l-7,-7 z")
        this._selectorElem
            .append("path")
            .attr(
                "d",
                "M0," +
                    -0.4 * margin.top +
                    " v" +
                    (this._height + margin.top * 0.7)
            )
    }

    _updateSelectorPosition(): void {
        if (!this.actualTargetDate) {
            return
        }
        if (!this._xScale) {
            return
        }
        const selectorPositionX = this._xScale(moment(this.actualTargetDate))
        this._selectorElem.attr(
            "transform",
            "translate(" + selectorPositionX + ")"
        )
    }

    _renderChart(
        chartObj: any, //d3.Line<[number, number]>
        chartClass: string
    ): void {
        const charts = this._chartsElem
            .selectAll("." + chartClass)
            .data([this.chartData])
            .attr("class", chartClass)

        charts.exit().remove()

        charts
            .enter()
            .append("path")
            .attr("class", chartClass)
            .attr("d", chartObj)
            .merge(charts)
            .attr("d", chartObj)
    }

    _renderSubchart(
        chartObj: any, //d3.Line<[number, number]>
        chartClass: string
    ): void {
        const brushCharts = this._subElemCharts
            .selectAll("." + chartClass)
            .data([this.chartPreviewData])
            .attr("class", chartClass)

        brushCharts.exit().remove()

        brushCharts
            .enter()
            .append("path")
            .attr("class", chartClass)
            .attr("d", chartObj)
            .merge(brushCharts)
            .attr("d", chartObj)
    }

    _onUserDragSelector(): void {
        // @ts-ignore: Unreachable code error
        this._selectorElem.attr("transform", "translate(" + d3.event.x + ", 0)")
        // @ts-ignore: Unreachable code error
        let date = moment(this._xScale.invert(d3.event.x))
        if (date < this.time_machine_actual_date_range.from) {
            date = this.time_machine_actual_date_range.from
        }
        if (
            this.time_machine_actual_date_range.to &&
            date > this.time_machine_actual_date_range.to
        ) {
            date = this.time_machine_actual_date_range.to
        }

        this.sharedState.set("time_machine_target_date", date)
    }

    _formatXaxis(item: moment.MomentInput): string {
        return moment(item).format("MMM DD hh:mm A")
    }

    _renderSubchartSelector(): void {
        $(".sub-selector").detach()
        if (!this.actualTargetDate) {
            return
        }
        this._subchartSelectorElem = this._subSvgElem
            .append("g")
            .attr("class", "sub-selector")

        this._subchartSelectorElem.append("path").attr("d", "M0,0 v" + 30)
    }

    _updateSubchartSelectorPosition(): void {
        if (
            !this._subchartSelectorElem ||
            !this.actualTargetDate ||
            !this._xScale
        ) {
            $(".sub-selector").detach()
            return
        }
        const date = moment(this.actualTargetDate)
        const position = this._subXScale(date)
        this._subchartSelectorElem.attr(
            "transform",
            "translate(" + position + ")"
        )
    }

    _onUserChartClick(): void {
        // @ts-ignore: Unreachable code error
        const posX = d3.event.x + this._calculateCoeff(d3.event.x, 25)
        const date = this._xScale.invert(posX)
        this.sharedState.set("time_machine_enabled", true)
        this.sharedState.set("time_machine_target_date", date)
    }

    _calculateCoeff(cursorX: number, padding: number): number {
        const halfWidth = this._width / 2
        const distFromCenter = cursorX - halfWidth
        const remotenessСoeff = distFromCenter / (halfWidth / 10) - padding
        return remotenessСoeff
    }

    _renderHoverLine(): void {
        const self = this
        this._chartsElem
            .on("mouseenter", function () {
                self._hoverLineElem.attr("display", "inherit")
            })
            .on("mousemove", function () {
                // @ts-ignore: Unreachable code error
                let mousex = d3.mouse(this)
                mousex = mousex[0]
                self._hoverLineElem.attr(
                    "transform",
                    "translate(" + mousex + ")"
                )
                self._renderTooltip(mousex)
            })
            .on("mouseover", function () {
                // @ts-ignore: Unreachable code error
                let mousex = d3.mouse(this)
                mousex = mousex[0]
                self._hoverLineElem.attr(
                    "transform",
                    "translate(" + mousex + ")"
                )
            })
            .on("mouseleave", function () {
                self._hoverLineElem.attr("display", "none")
                self._tooltipElem.style("opacity", "0")
            })
    }

    _renderTooltip(mousex: number): void {
        if (this._tooltipElem) {
            this._tooltipElem.html("")
        }
        // @ts-ignore: Unreachable code error
        const bisectDate = d3.bisector((d) => d.dateMoment).left
        const date = this._xScale.invert(mousex)
        const foundId = bisectDate(this.chartData, moment(date))

        if (!this.chartData[foundId]) {
            return
        }
        const formattedDate = moment(date).format("MMM DD hh:mm A")
        const { changes, error, warn } = this.chartData[foundId]
        const tooltipHtml =
            (this.isTimeMachineActive
                ? ""
                : "<p>Click to activate Time Machine at </p>") +
            `<p><b>${formattedDate}</p></b>
            <p class="txt-white">Changes${
                this.wrap ? "<br>" : ": "
            }<b>${changes}</b></p>
            <p class="txt-red">Errors${
                this.wrap ? "<br>" : ": "
            }<b>${error}</b></p>
            <p class="txt-orange">Warnings${
                this.wrap ? "<br>" : ": "
            }<b>${warn}</b>
          </p>`

        const posX = mousex - this._calculateCoeff(mousex, 20)

        this._tooltipElem
            .style("opacity", "1")
            .html(tooltipHtml)
            .style(
                "transform",
                "translate(" +
                    posX +
                    "px, " +
                    (this.wrap ? this._height / 2 - 80 : this._height / 8) +
                    "px)"
            )
    }

    _updateHoverLineHeight(): void {
        if (!this._hoverLineElem) {
            return
        }
        const margin = this._getMargin()
        this._hoverLineElem.attr(
            "d",
            "M0," + -0.4 * margin.top + " v" + (this._height + margin.top * 0.7)
        )
    }

    _activateMainChartDomain(): void {
        if (!this._xScale) {
            return
        }

        if (
            !this.time_machine_actual_date_range.from ||
            !this.time_machine_actual_date_range.to
        ) {
            this._xScale.domain([])
        } else {
            this._xScale.domain([
                this.time_machine_actual_date_range.from,
                this.time_machine_actual_date_range.to,
            ])
        }
    }

    _dateRangesAreSame(newActual: Actual): boolean {
        return (
            this._datesAreSame(
                this.time_machine_actual_date_range.from,
                newActual.from
            ) &&
            !!this.time_machine_actual_date_range.to &&
            !!newActual.to &&
            this._datesAreSame(
                this.time_machine_actual_date_range.to,
                newActual.to
            )
        )
    }

    _datesAreSame(oldDate: moment.Moment, newDate: moment.Moment): boolean {
        if (oldDate) {
            return oldDate.isSame(newDate)
        }
        return false
    }

    componentDidMount() {
        this._parentElem = d3.select(".chart-view")
        this._setup()

        this.subscribeToSharedState(
            ["time_machine_actual_date_from", "time_machine_actual_date_to"],
            () => {
                let actual = this._timelineUtils.getActualRange()

                if (this._dateRangesAreSame(actual)) {
                    return
                }
                if (this._movingTheBrush) {
                    return
                }

                let diff = moment.duration(actual.to.diff(actual.from))
                this.durationSeconds = diff.asSeconds()

                this.time_machine_actual_date_range = actual

                this._calculateBrushInit()
            }
        )

        this.subscribeToSharedState(
            ["time_machine_enabled", "time_machine_target_date"],
            ({ time_machine_enabled, time_machine_target_date }) => {
                this.actualTargetDate = moment(
                    time_machine_target_date
                ).toISOString()
                this.isTimeMachineActive = time_machine_enabled
                if (!time_machine_enabled || !time_machine_target_date) {
                    this.actualTargetDate = null
                }
                this._renderSelector()
                this._updateSelectorPosition()
                this._renderSubchartSelector()
                this._updateSubchartSelectorPosition()
            }
        )

        this.subscribeToSharedState(
            "time_machine_timeline_data",
            (time_machine_timeline_data) => {
                this.chartData = time_machine_timeline_data || []

                this._renderTimelineMain()
            }
        )

        this.subscribeToSharedState(
            "time_machine_timeline_preview",
            (time_machine_timeline_preview) => {
                this.chartPreviewData = time_machine_timeline_preview || []

                this._renderTimelineSub()
            }
        )
    }

    render() {
        return (
            <div id="timelineComponent" className="timeline size-to-parent">
                <div className="chart-view"></div>
                <div className="tl-actions">
                    <TimelineButtons />
                </div>
            </div>
        )
    }
}
