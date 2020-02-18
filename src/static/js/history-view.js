class HistoryView {

    constructor(parentElem)
    {
        this._parentElem = parentElem;
    }

    get data() {
        return historyScope.data;
    }

    setup()
    {
        this._svgElem = this._parentElem
            .append("svg")
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
        this._width = size.width;
        this._height = size.height;

        var margin = this._getMargin();
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
        return { 
            top: this._height * 0.2,
            right: this._width * 0.1,
            bottom: this._height * 0.2,
            left: this._width * 0.1 
        };
    }

    render()
    {
        this._setupScales();
        
        this._renderCharts();

        this._renderAxis();

        this._renderSelector();
    }

    _setupScales()
    {
        this._xScale = d3
            .scaleTime()
            .domain(d3.extent(this.data, function(d) {
                return +Date.parse(d.date);
            }))
            .range([0, this._width]);
        this._yScaleItems = d3
            .scaleLinear()
            .domain(d3.extent(this.data, function(d) { return d.items; }))
            .range([this._height, 0]);
        this._yScaleAlerts = d3
            .scaleLinear()
            .domain(d3.extent(this.data, function(d) { return d.alerts; }))
            .range([this._height, 0]);
    }

    _renderCharts()
    {
        // Create & append area chart
        {
            const alerts = d3.area()
                .x((d) => { return this._xScale(new Date(d.date)); })
                .y0(this._height)
                .y1((d) => { return this._yScaleAlerts(d.alerts); });
            this._renderChart(alerts, 'alerts');
        }

        // Create & append line chart
        {
            const items = d3.line()
                .x((d) => { return this._xScale(+Date.parse(d.date)); })
                .y((d) => { return this._yScaleItems(d.items);  });

            this._renderChart(items, 'changes');
        }
    }

    _renderAxis()
    {
        this._axisElem.html('');

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
            );

        this._axisElem
            .append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(this._yScaleItems));

        this._axisElem
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + this._width + ", 0)")
            .call(d3.axisRight(this._yScaleAlerts));
    }

    _renderSelector()
    {
        var margin = this._getMargin();
        this._selectorElem.html("");
        this._selectorElem
            .append("path")
            .attr("d", "M-7," + (-0.4 * margin.top) + " h14 v20 l-7,7 l-7,-7 z");
        this._selectorElem
            .append("path")
            .attr("d", "M0," + (-0.4 * margin.top) + " v" + (this._height + margin.top * 0.7));
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
        const x = d3.event.x;

        this._selectorElem.attr("transform", "translate(" + x + ")");

        const date = +Date.parse(this._xScale.invert(x));

        const bisectDate = d3.bisector(function(d) {
            return +Date.parse(d.date);
        }).left;

        console.log("date: ", new Date(date).toISOString());

        const idx = bisectDate(this.data, date);
        console.log("index: " + idx + "selected timeline node: ", this.data[idx]);
    }
};


var historyScope = {
    historyView: null,
    data: []
}
$(document).on("layout-ready", function(e){
    historyScope.historyView = new HistoryView(d3.select("#timeline"));
    historyScope.historyView.setup();
});