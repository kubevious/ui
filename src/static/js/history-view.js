class HistoryView {

    constructor(parentElem)
    {
        this._parentElem = parentElem;
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
    }

    render()
    {

    }
};

$(document).on("layout-ready", function(e){
    var historyView = new HistoryView(d3.select("#timeline"));
    historyView.setup();
    historyView.render();
});