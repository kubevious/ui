class HistoryView {

    constructor(parentElem)
    {
        this._parentElem = parentElem;
        this._selectorPositionX = 0;
        this._selectorPositionDate = null;
        this._showAxis = false;
        this._selectorVisible = false;
    }

    get data() {
        return historyScope.data;
    }

    setSelectorVisibility(value)
    {
        this._selectorVisible = value;
        this.render();
    }

    setup()
    {
        this._svgElem = this._parentElem
            .insert("svg", ":first-child")
            .attr("position", "absolute")
            .attr("overflow", "hidden")
            .attr("top", 0)
            .attr("left", 0)
            .attr("right", 0)
            .attr("bottom", 0)
            .attr("width", "100%")
            .attr("height", "100%")

        this._axisElem = this._svgElem
            .append("g")
            .attr("class", "axis")

        this._chartsElem = this._svgElem
            .append("g")
            .attr("class", "charts")
        
        this._selectorElem = this._svgElem
            .append("g")
            .attr("class", "selector")
        this._selectorElem
            .call(
                d3.drag().on("drag", this._selectorDragged.bind(this))
            );

        $(document).on('layout-resize-timelineComponent', () => {
            this.setupDimentions();
        });

        this.setupDimentions();
    }

    setupDimentions(size)
    {
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
            .attr("viewBox", viewBox.join(' '));

        // Render
        this.render();
    }

    _getMargin()
    {
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

    render()
    {
        this._setupScales();
        
        this._calculateSelectorPosition();

        this._renderCharts();

        this._renderAxis();

        this._renderSelector();
    }

    _setupScales()
    {
        this._xScale = d3
            .scaleTime()
            .domain(d3.extent(this.data, function(d) {
                return d.date;
            }))
            .range([0, this._width]);
        this._yScaleItems = d3
            .scaleLinear()
            .domain(d3.extent(this.data, function(d) { return d.items; }))
            .range([this._height, 0]);
        this._yScaleAlerts = d3
            .scaleLinear()
            .domain(d3.extent(this.data, function(d) { return d.alerts; }))
            .range([this._height, 0])
            ;
    }

    _renderCharts()
    {
        // Create & append area chart
        {
            const alerts = d3.area()
                .x((d) => { return this._xScale(d.date); })
                .y0(this._height)
                .y1((d) => { return this._yScaleAlerts(d.alerts); });
            this._renderChart(alerts, 'alerts');
        }

        // Create & append line chart
        {
            const items = d3.line()
                .x((d) => { return this._xScale(d.date); })
                .y((d) => { return this._yScaleItems(d.items);  });

            this._renderChart(items, 'changes');
        }
    }

    _renderAxis()
    {
        this._axisElem.html('');

        var horizontalTickCount = Math.max(1, this._width/200);
        this._axisElem
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + this._height + ")")
            .call(d3
                .axisBottom(this._xScale)
                .tickFormat(function(d){
                    return d.toISOString();
                    // return d3.timeFormat("%H:%M")(d)
                })
                .ticks(horizontalTickCount)
                
            );

        if (this._showAxis)
        {
            var verticalTickCount = Math.max(1, this._height/20);
            this._axisElem
                .append("g")
                .attr("class", "y axis")
                .call(d3
                    .axisLeft(this._yScaleItems)
                    .ticks(verticalTickCount));
    
            this._axisElem
                .append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + this._width + ", 0)")
                .call(d3
                    .axisRight(this._yScaleAlerts)
                    .ticks(verticalTickCount));
        }
    }

    _renderSelector()
    {
        this._selectorElem.html("");

        if (!this._selectorVisible) {
            return;
        }

        var margin = this._getMargin();
        this._selectorElem
            .append("path")
            .attr("d", "M-7," + (-0.4 * margin.top) + " h14 v20 l-7,7 l-7,-7 z");
        this._selectorElem
            .append("path")
            .attr("d", "M0," + (-0.4 * margin.top) + " v" + (this._height + margin.top * 0.7));
        
        this._setupSelectorPosition();
    }

    _setupSelectorPosition()
    {
        if (this._selectorPositionX < 0) {
            this._selectorPositionX = 0;
        }
        if (this._selectorPositionX > this._width) {
            this._selectorPositionX = this._width;
        }

        this._selectorElem.attr("transform", "translate(" + this._selectorPositionX + ")");
    }

    _renderChart(chartObj, chartClass)
    {
        const charts = this._chartsElem.selectAll("." + chartClass)
            .data([this.data])
            .attr("class", chartClass);

        charts.exit()
            .remove();

        charts.enter()
            .append("path")
                .attr("class", chartClass)
                .attr("d", chartObj)
            .merge(charts)
                .attr("d", chartObj)
    }

    _selectorDragged()
    {
        this._selectorPositionX = d3.event.x;
        this.selectDate( this._xScale.invert(this._selectorPositionX), true)

    }

    _calculateSelectorPosition()
    {
        if (this._selectorPositionDate) {
            this._selectorPositionX = this._xScale(this._selectorPositionDate);
        } else {
            this._selectorPositionX = 0;
        }
    }

    selectDate(date, skipPositionCalculate)
    {
        if (this._selectorPositionDate - date == 0) {
            return;
        }
        this._selectorPositionDate = date;
        if (!skipPositionCalculate) {
            this._calculateSelectorPosition();
        }
        this._setupSelectorPosition();

        // const bisectDate = d3.bisector(function(d) {
        //     return +Date.parse(d.date);
        // }).left;
        // const idx = bisectDate(this.data, date);
        // console.log("index: " + idx + "selected timeline node: ", this.data[idx]);

        this.handleDateChange(this._selectorPositionDate);
    }

    handleDateChange(date)
    {
        console.log("[handleDateChange] " + date.toISOString());
        historyScope.client.selectDate(date);
    }
};


$(document).on("layout-ready", function(e){
    historyScope.view = new HistoryView(d3.select("#timeline"));
    historyScope.view.setup();
});