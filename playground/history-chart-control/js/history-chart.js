function applyHistoryChartData(data) {
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const margin = { top: height * 0.2, right: width * 0.1, bottom: height * 0.2, left: width * 0.1 };

    // Create SVG element
    const svg = d3
        .select("#chart svg");

    svg
        .html("")
        .attr("viewBox", (-margin.left) + " " + (-margin.top) + " " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom));

    // Set up scales
    const bisectDate = d3.bisector(function(d) {
        return +Date.parse(d.date);
    }).left;
    const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, function(d) {
            return +Date.parse(d.date);
        }))
        .range([0, width]);
    const yScaleLeft = d3
        .scaleLinear()
        .domain(d3.extent(data, function(d) { return d.items; }))
        .range([height, 0]);
    const yScaleRight = d3
        .scaleLinear()
        .domain(d3.extent(data, function(d) { return d.alerts; }))
        .range([height, 0]);


    // Create & append area chart
    const area = d3.area()
        .x(function(d) { return xScale(new Date(d.date)); })
        .y0(height)
        .y1(function(d) { return yScaleRight(d.alerts); });
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    // Create & append line chart
    const line = d3.line()
        .x(function(d) { return xScale(+Date.parse(d.date)); })
        .y(function(d) { return yScaleLeft(d.items);  });
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    // Create & append selector line
    const selector = svg
        .append("g")
        .attr("class", "selector");
    selector
        .append("path")
        .attr("d", "M-7," + (-0.4 * margin.top) + " h14 v20 l-7,7 l-7,-7 z");
    selector
        .append("path")
        .attr("d", "M0," + (-0.4 * margin.top) + " v" + (height + margin.top * 0.7));
    selector
        .call(
            d3.drag().on("drag", dragged)
        );

    function dragged() {
        const x = d3.event.x;

        d3.select(this).attr("transform", "translate(" + x + ")");

        const date = +Date.parse(xScale.invert(x));
        const idx = bisectDate(data, date);
        console.log("items: ", data[idx].items);
        console.log("alerts: ", data[idx].alerts);
    }

    // Append axis to the chart
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3
            .axisBottom(xScale)
            .tickFormat(function(d){
                return d3.timeFormat("%H:%M")(d)
            })
        );
    svg
        .append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScaleLeft));
    svg
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ", 0)")
        .call(d3.axisRight(yScaleRight));

    // Create a transparent rect over the chart to handle mouse events
    // svg
    //     .append("rect")
    //     .style("fill", "none")
    //     .style("pointer-events", "all")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width", width)
    //     .attr("height", height)
    //     .on("mousemove", function () {
    //         const x = d3.mouse(this)[0];
    //         const date = +Date.parse(xScale.invert(x));
    //         const idx = bisectDate(data, date);
    //
    //         selector
    //             .attr("transform", "translate(" + x + ")");
    //
    //         console.log("items: ", data[idx].items);
    //         console.log("alerts: ", data[idx].alerts);
    //     });
}
