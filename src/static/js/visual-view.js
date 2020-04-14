class VisualView {

    constructor(parentElem)
    {
        this._parentElem = parentElem;
        this._width = 0;
        this._height = 0;

        this._viewX = 0;
        this._viewY = 0;

        this._showRoot = true;
        this._selectedNodes = [];

        this._onNodeSelectCb = [];

        this._controlInfo = {};

        this._flatVisualNodes = [];

        this._existingNodeIds = {};
        // this._visibleNodeIds = {};
        this._expandedNodeIds = {};
        this._selectedNodeIds = {};
    }

    _measureText(text, fontSpec) {
        if (!fontSpec) {
            throw new Error("MISSING FONT SPEC");
        }
        
        if (_.isNil(text)) {
            text = "";
        } 
        else if (!_.isString(text)) 
        {
            text = text.toString();
        }

        var totalWidth = 0;
        var totalHeight = fontSpec.height;
        for(var i = 0; i < text.length; i++)
        {
            var code = text.charCodeAt(i);
            var index = code - fontSpec.startCode;
            var width;
            if (index < 0 || index >= fontSpec.widths.length) {
                width = fontSpec.defaultWidth;
            } else {
                width = fontSpec.widths[index];
            }
            totalWidth += width;
        }
        return {
            width: totalWidth,
            height: totalHeight
        };
    }

    skipShowRoot() {
        this._showRoot = false;
    }

    setup()
    {
        this._d3NodeDict = {};
        this._d3SmallNodeDict = {};

        this._svgElem = this._parentElem
            .append("svg")
            .attr("position", "absolute")
            .attr("overflow", "hidden")
            .attr("top", 0)
            .attr("left", 0)
            .attr("right", 0)
            .attr("bottom", 0)

        $(document).on('layout-resize-universeComponent', () => {
            this.setupDimentions();
        });

        this.setupDimentions();

        this._rootElem = this._svgElem.append("g");
        
        this._renderControl();

        this._setupPanning();
    }

    _renderControl()
    {
        var self = this;

        this._controlInfo.previewGroupElem = this._svgElem.append("g")
            .attr("class", "preview");

        this._controlInfo.previewFullRectElem = this._controlInfo.previewGroupElem
            .append("rect")
            .attr("class", "preview-full-rect");

        this._controlInfo.previewItemsGroupElem = this._controlInfo.previewGroupElem
            .append("g")
            .attr("class", "preview-items-group")
            ;

        this._controlInfo.previewVisibleRectElem = this._controlInfo.previewGroupElem
            .append("rect")
            .attr("class", "preview-visible-rect");

        this._controlInfo.previewGroupElem
            .on("click", () => {
                let pt = this._svgElem.node().createSVGPoint();
                pt.x = d3.event.clientX;
                pt.y = d3.event.clientY;
                var target = self._controlInfo.previewFullRectElem._groups[0][0];
                var cursorpt =  pt.matrixTransform(target.getScreenCTM().inverse());
                this._viewX = cursorpt.x / self._controlInfo.scale - this._width / 2;
                this._viewY = cursorpt.y / self._controlInfo.scale - this._height / 2;
                this._applyPanTransform();
            })
            .call(d3.drag()
                .on("drag", (d) => {
                    this._viewX += d3.event.dx / this._controlInfo.scale;
                    this._viewY += d3.event.dy / this._controlInfo.scale;
                    this._applyPanTransform();
                }));
    }

    setupDimentions(size)
    {
        if (!size) {
            size = this._parentElem.node().getBoundingClientRect();
        }
        this._width = size.width;
        this._height = size.height;

        this._setupControl();
        this._applyPanTransform();
    }

    _setupControl()
    {
        if (!this._visualRoot) {
            return;
        }

        var boxScale = 5
        this._controlInfo.boxWidth = Math.max(100, this._width / boxScale);
        this._controlInfo.boxHeight = Math.max(100, this._height / boxScale);

        this._controlInfo.scale = Math.min(
            this._controlInfo.boxWidth / this._visualRoot.width,
            this._controlInfo.boxHeight / this._visualRoot.height);

        this._controlInfo.boxWidth = 
            Math.max(100, this._visualRoot.width * this._controlInfo.scale);
        this._controlInfo.boxHeight = 
            Math.max(100, this._visualRoot.height * this._controlInfo.scale);

        this._controlInfo.x = this._width - this._controlInfo.boxWidth - 20;
        this._controlInfo.y = this._height - this._controlInfo.boxHeight - 20;

        if (this._controlInfo.previewGroupElem)
        {
            this._controlInfo.previewGroupElem.attr("transform", (d) => { 
                return  "translate(" + this._controlInfo.x + "," + this._controlInfo.y+ ")"
                    ;
            })
        }
        else
        {
            throw new Error("MISSING PREVIEW GROUP ELEM");
        }

        if (this._controlInfo.previewFullRectElem)
        {
            this._controlInfo.previewFullRectElem
                .attr("width", this._controlInfo.boxWidth)   // this._visualRoot.width * this._controlInfo.scale)
                .attr("height", this._controlInfo.boxHeight) // this._visualRoot.height * this._controlInfo.scale);
        }

        if (this._controlInfo.previewItemsGroupElem) {
            this._controlInfo.previewItemsGroupElem.attr("transform", (d) => { 
                return "scale(" + this._controlInfo.scale + ", " + this._controlInfo.scale + ")"
                    ; 
            }) 
        }

        if (this._controlInfo.previewVisibleRectElem) {
            this._controlInfo.previewVisibleRectElem
                .attr("x", this._viewX * this._controlInfo.scale)
                .attr("y", this._viewY * this._controlInfo.scale)
                .attr("width", this._width * this._controlInfo.scale)
                .attr("height", this._height * this._controlInfo.scale)
                ;
        }

        // this._renderSmallItems();
    }

    _setupPanning()
    {
        this._setupPanningByMouseDrag();
        
        this._setupPanningByWheel();

        this._applyPanTransform();
    }

    _setupPanningByMouseDrag()
    {
        var drag = d3.drag()
            .on("drag", (d) => {
                this._viewX -= d3.event.dx;
                this._viewY -= d3.event.dy;
        
                this._applyPanTransform();
            })
            ;
        this._svgElem.call(drag);
    }

    _setupPanningByWheel()
    {
        var doScroll = (e) => {
            this._viewX += e.deltaX;
            this._viewY += e.deltaY;
            this._applyPanTransform();

            e.preventDefault();
        };
          
        var elem = document.getElementById("diagram");
        if (elem.addEventListener) {
            elem.addEventListener("wheel", doScroll, false);
        }
    }

    _applyPanTransform()
    {
        if (!this._rootElem) {
            return;
        }
        
        if (this._visualRoot) {
            this._viewX = Math.min(this._visualRoot.width - this._width, this._viewX);
            this._viewY = Math.min(this._visualRoot.height - this._height, this._viewY);
        }
        this._viewX = Math.max(0, this._viewX);
        this._viewY = Math.max(0, this._viewY);

        this._rootElem.attr("transform", (d) => { 
            return "translate(" + (-this._viewX) + "," + (-this._viewY) + ")"; 
        })

        // d3
        //     .select(this._rootElem.node)
        //     .transition()
        //     .duration(200)
        //     .attr("transform", (d) => { 
        //         return "translate(" + (-this._viewX) + "," + (-this._viewY) + ")"; 
        //     })

        this._setupControl();
    }

    acceptSourceData(sourceData)
    {
        this._visualRoot = this._packSourceData(sourceData);
        this._massageSourceData();
        this._setupControl();
    }

    _packSourceData(root) {
        var recurse = (node, parent) => {
            var visualNode = new VisualNode(this, node, parent);
            if (!node.children) {
                node.children = [];
            }
            for(var child of node.children) {
                recurse(child, visualNode);
            }
            visualNode.prepare();
            return visualNode;
        }

        return recurse(root, null);
    }

    _massageSourceData()
    {
        if (!this._visualRoot) {
            return;
        }
        this._visualRoot.autoexpand();
        this._visualRoot.measureAndArrange();
        this._visualRoot.calculateAbsolutePos();
        this._flatVisualNodes = this._visualRoot.extract();
        if (!this._showRoot) {
            this._flatVisualNodes.shift();
        }
    }

    render()
    {
        this._renderItems(this._rootElem, this._flatVisualNodes);
        this._renderSmallItems();
    }

    _renderSmallItems()
    {
        this._renderItemsSmall(this._controlInfo.previewItemsGroupElem, this._flatVisualNodes);
    }

    _renderItems(parentNode, items)
    {
        var self = this;
        var node =
            parentNode.selectAll("g")
            .data(items, function (d) { 
                return d.id; 
            });

        node
            .exit()
            //.transition()
            //.duration(500)
            //.delay(100)
            //.attr("width", function (d) { return 0; })
            //.attr("height", function (d) { return 0; })
            .each(function(d) { 
                delete self._d3NodeDict[d.id];
            })
            .remove();
        
        node = node
            .enter()
            .append("g")
            .attr("class", function(d) { 
                if (d.isSelected) {
                    return "node selected";
                }
                return "node"; 
            })
            .attr("id", function(d) { 
                return d.id; 
            })
            .attr("transform", nodeGroupTransform)
            .each(function(d) { 
                self._d3NodeDict[d.id] = this;
            })

        node.append("rect")
            .attr("class", "node-bg")
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .style("fill", nodeBgFillColor)
            .style("stroke", nodeStrokeColor)
            ;

        node.append("rect")
            .attr("class", "node-header")
            .attr("width", nodeWidth)
            .attr("height", nodeHeaderBgHeight)
            .style("fill", nodeHeaderBgFillColor)
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node.append("rect")
            .attr("class", "node-header-hl")
            .attr("width", nodeHeaderBgWidth)
            .attr("height", nodeHeaderBgHeight)
            .style("fill", nodeHeaderHlFillColor)
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node
            .append("image")
            .attr("class", "node-logo")
            .attr("xlink:href", function(d) {
                return getNodeLogoUrl(d.data.kind);
            })
            .attr("x", nodeHeaderX("logo"))
            .attr("y", nodeHeaderY("logo"))
            .attr("width", nodeHeaderWidth('logo'))
            .attr("height", nodeHeaderHeight('logo'))
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node.append("text")
            .attr("class", "node-title-kind")
            .text(nodeHeaderText('title-kind'))
            .attr("transform", nodeHeaderTransform('title-kind'))  
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node.append("text")
            .attr("class", "node-title-name")
            .text(nodeHeaderText('title-name'))
            .attr("transform", nodeHeaderTransform('title-name'))
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node
            .each(function (d) { 
                self._renderNodeExpander(d);
                self._renderNodeSeverity(d);
                self._renderNodeFlags(d);
            })
    }

    _renderNodeExpander(visualNode)
    {
        var selection = 
            d3.select(visualNode.node)
                .selectAll(".node-expander")
                .data(visualNode.expanderNodes, function (x) { 
                    return x.headerName;
                });

        selection
            .exit()
            .remove();

        selection
            .enter()
                .append("image")
                .attr("class", "node-expander")
                .attr("xlink:href", x => x.imgSrc)
                .attr("x", x => x.x()) 
                .attr("y", x => x.y())
                .attr("width", x => x.width())
                .attr("height", x => x.height())
                .on("click", nodePerformExpandCollapse)
                ;
    }

    _renderNodeSeverity(visualNode)
    {
        {
            var selection = 
                d3.select(visualNode.node)
                    .selectAll(".node-severity")
                    .data(visualNode.severityNodes, function (x) { 
                        return x.headerName;
                    });

            selection
                .exit()
                    .remove();
        
            selection
                .enter()
                    .append("rect")
                    .attr("class", "node-severity")
                    .attr("x", x => x.x()) 
                    .attr("y", x => x.y())
                    .attr("width", x => x.width())
                    .attr("height", x => x.height())
                    .attr("rx", 10)
                    .style("fill", "red")
                    .on("click", nodePerformSelect)
                    .on("dblclick", nodePerformExpandCollapse)
        }

        {
            var selection = 
                d3.select(visualNode.node)
                    .selectAll(".node-severity-text")
                    .data(visualNode.severityTextNodes, function (x) { 
                        return x.headerName;
                    });

            selection
                .exit()
                    .remove();
        
            selection
                .enter()
                    .append("text")
                    .attr("class", "node-severity-text")
                    .text(x => x.text()) 
                    .attr("transform", x => x.transform())
                    .on("click", nodePerformSelect)
                    .on("dblclick", nodePerformExpandCollapse)
        }
    }

    _renderNodeFlags(visualNode)
    {
        var self = this;
        var selection = 
            d3.select(visualNode.node)
                .selectAll(".node-flag")
                .data(visualNode.flagNodes, function (x) { 
                    return x.headerName;
                });

        selection
            .exit()
            .remove();

        selection
            .enter()
                .append("image")
                .attr("class", "node-flag")
                .attr("xlink:href", x => x.imgSrc)
                .attr("x", x => x.x()) 
                .attr("y", x => x.y())
                .attr("width", x => x.width())
                .attr("height", x => x.height())
                .on("mouseover", function (d, i) {
                    self._showFlagTooltip(this, d.flag);
                })
                .on("mouseout", function (d, i) {
                    self._closeFlagTooltip(this, d.name);
                });
      ;
    }

    _showFlagTooltip(elem, name)
    {
        var descr = FLAG_TOOLTIPS[name];
        if (!descr) {
            return;
        }
        var template = 
            '<div class="tooltip">' + 
        	'	<div class="tooltip-arrow"></div>' + 
        	'	<div class="tooltip-inner"></div>' + 
        	'</div>';
        $(elem).tooltip({
            template: template,
            title: descr,
            html: true
        });
        $(elem).tooltip('show');
    }

    _closeFlagTooltip(elem, name)
    {
        $(elem).tooltip('dispose');
    }

    _updateNode(visualNode, isFullUpdate)
    {
        var duration = 200;

        if (!visualNode.node) {
            return;
        }

        if (isFullUpdate)
        {
            this._renderNodeExpander(visualNode);
            this._renderNodeSeverity(visualNode);
            this._renderNodeFlags(visualNode);
        }
        else
        {
        }


        d3
            .select(visualNode.node)
            .selectAll(".node-flag")
            .transition()
            .duration(duration)
            .attr("x", x => {
                return x.x()
            }) 
            .attr("y", x => x.y())
            ;
            

        d3
            .select(visualNode.node)
            .select(".node-severity")
            .transition()
            .duration(duration)
            .attr("x", x => {
                var severityNode = _.head(x.severityNodes);
                if (severityNode) {
                    return severityNode.x();
                }
                return 0;
            })
            ;

        d3
            .select(visualNode.node)
            .select(".node-severity-text")
            .text(x => {
                var severityTextNode = _.head(x.severityTextNodes);
                if (severityTextNode) {
                    return severityTextNode.text();
                }
                return '';
            }) 
            .transition()
            .duration(duration)
            .attr("transform", x => {
                var severityTextNode = _.head(x.severityTextNodes);
                if (severityTextNode) {
                    return severityTextNode.transform();
                }
                return '';
            })
            ;

        d3
            .select(visualNode.node)
            .transition()
            .duration(duration)
            .attr("class", function(d) { 
                if (d.isSelected) {
                    return "node selected";
                }
                return "node"; 
            })
            .attr("transform", nodeGroupTransform)

        d3
            .select(visualNode.node)
            .select(".node-bg")
            .transition()
            .duration(duration)
            .attr("width", nodeWidth)
            .attr("height", nodeHeight)
            .style("fill", nodeBgFillColor)
            .style("stroke", nodeStrokeColor)

        d3
            .select(visualNode.node)
            .select(".node-header")
            .transition()
            .duration(duration)
            .attr("width", nodeWidth)
            .attr("height", nodeHeaderBgHeight)
            .style("fill", nodeHeaderBgFillColor)

        d3
            .select(visualNode.node)
            .select(".node-header-hl")
            .transition()
            .duration(duration)
            .attr("width", nodeHeaderBgWidth)
            .attr("height", nodeHeaderBgHeight)
            .style("fill", nodeHeaderHlFillColor)

        d3
            .select(visualNode.node)
            .select(".node-expander")
            .transition()
            .duration(duration)
            .attr("x", x => {
                var expanderNode = _.head(x.expanderNodes);
                if (expanderNode) {
                    return expanderNode.x();
                }
                return 0;
            })
            .attr("xlink:href", x => {
                var expanderNode = _.head(x.expanderNodes);
                if (expanderNode) {
                    return expanderNode.imgSrc;
                }
                return 0;
            })
            ;


        this._updateNodeSmall(visualNode);
    }

    _renderItemsSmall(parentNode, items)
    {
        var self = this;
        var node =
            parentNode.selectAll("g")
            .data(items, function (d) { 
                return d.id; 
            });

        node
            .exit()
            .each(function(d) { 
                delete self._d3SmallNodeDict[d.id];
            })
            .remove();
        
        node = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("id", function(d) { 
                return d.id; 
            })
            .attr("transform", nodeGroupTransform)
            .each(function(d) { 
                self._d3SmallNodeDict[d.id] = this;
            })

        node.append("rect")
            .attr("class", "node-bg")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .style("fill", nodeBgFillColor)
            ;

        node.append("rect")
            .attr("class", "node-header-hl")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.headerHeight; })
            .style("fill", nodeHeaderHlFillColor)
            ;
    }

    _updateNodeSmall(visualNode)
    {
        var self = this;

        var duration = 200;

        if (!visualNode.smallNode) {
            return;
        }

        d3
            .select(visualNode.smallNode)
            .transition()
            .duration(duration)
            .attr("transform", nodeGroupTransform)

        d3
            .select(visualNode.smallNode)
            .select(".node-bg")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width; })
            .attr("height", function (d) { return d.height; })

        d3
            .select(visualNode.smallNode)
            .select(".node-header-hl")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width; })
            .style("fill", nodeHeaderHlFillColor)
    }

    _updateNodeR(visualNode, isFullUpdate)
    {
        this._updateNode(visualNode, isFullUpdate);
        for(var child of visualNode.visibleChildren) {
            this._updateNodeR(child, isFullUpdate);
        }
    }

    updateAll(isFullUpdate)
    {
        this._massageSourceData();
        this._applyPanTransform();
        this._setupControl();
        this.render();
        if (this._visualRoot) {
            this._updateNodeR(this._visualRoot, isFullUpdate);
        }
        this._setupControl();
    }

    onNodeSelect(cb) {
        this._onNodeSelectCb.push(cb);
    }

    selectNode(visualNode)
    {
        if (visualNode.isSelected)
        {
            visualNode.isSelected = false;
            for(var node of this._selectedNodes)
            {
                node.isSelected = false;
                this._updateNode(node);
            }
            this._selectedNodes = [];
        }
        else
        {
            for(var node of this._selectedNodes)
            {
                node.isSelected = false;
                this._updateNode(node);
            }
            this._selectedNodes = [];
            visualNode.isSelected = true;
            this._selectedNodes.push(visualNode)
        }
        this._updateNode(visualNode);

        for(var x of this._onNodeSelectCb) {
            if (this._selectedNodes.length == 0) {
                x(null, null);
            } else {
                for(var node of this._selectedNodes) {
                    x(node, node.data);
                }
            }
        }

        // if (visualNode.isSelected)
        // {
        //     this._viewX = visualNode.absX - 10;
        //     this._viewY = visualNode.absY - 10;
        //     this._applyPanTransform();
        // }
    }

    selectNodeByDn(dn)
    {
        if (!this._visualRoot) {
            return;
        }
        var dnParts = parseDn(dn);
        var topPart = _.head(dnParts);
        if (topPart.rn != this._visualRoot.data.rn) {
            return;
        }
        this._selectAndExpandNode(this._visualRoot, dnParts.slice(1));
    }

    _selectAndExpandNode(visualNode, childParts)
    {
        visualNode.isExpanded = true;
        this.updateAll();
        
        if (childParts.length == 0) {
            this.selectNode(visualNode);
            this.updateAll();

            this._viewX = 
                visualNode.absX
                - Math.max(this._width / 2 - visualNode.width / 2, 10)
                ;
            
            this._viewY =
                visualNode.absY
                - Math.max(this._height / 2 - visualNode.height / 2, 10)
                ;

            this._applyPanTransform();
            return;
        }

        var topPart = _.head(childParts);
        var childVisualNode = visualNode.findChildByRn(topPart.rn);
        if (!childVisualNode) {
            this._selectAndExpandNode(visualNode, []);
            return;
        }

        this._selectAndExpandNode(childVisualNode, childParts.slice(1));
    }
}

function nodePerformExpandCollapse(d)
{
    d.isExpanded = !d.isExpanded;
    d.view.updateAll();
}

function nodePerformSelect(d)
{
    d.view.selectNode(d);
}

function nodeHeight(d)
{
    return d.height;
}

function nodeWidth(d)
{
    return d.width;
}

function nodeHeaderBgHeight(d)
{
    return d.headerHeight;
}

function nodeHeaderBgWidth(d)
{
    if (d.isSelected) {
        return d.width;
    }
    return d.headerHeight;
}

function nodeHeaderBgFillColor(d)
{
    return d.headerBgFillColor;
}

function nodeHeaderHlFillColor(d)
{
    return d.headerFillColor;
}

function nodeBgFillColor(d)
{
    return d.bgFillColor;
}

function nodeStrokeColor(d)
{
    return d.strokeColor;
}

function nodeGroupTransform(d) { 
    return "translate(" + d.absX + "," + d.absY + ")"; 
}

function nodeExpanderImage(d) {
    if (d.isExpanded) {
        return "img/collapse.svg";
    } else {
        return "img/expand.svg";
    }
}

function nodeHeaderTransform(headerName, flavor) { 
    return (d) => {
        return "translate(" + d.getHeaderX(headerName, flavor) + "," + d.getHeaderY(headerName, flavor) + ")"; 
    }
}

function nodeHeaderFlagImage(headerName) { 
    return (d) => {
        var header = d.getHeader(headerName);
        if (!header) {
            // TODO: Error
            return '';
        }
        return "img/flags/" + header.icon + ".svg";
    }
}

function nodeHeaderX(headerName, flavor) { 
    return (d) => {
        return d.getHeaderX(headerName, flavor);
    }
}

function nodeHeaderY(headerName, flavor) { 
    return (d) => {
        return d.getHeaderY(headerName, flavor);
    }
}

function nodeHeaderWidth(headerName, flavor) { 
    return (d) => {
        var header = d.getHeader(headerName);
        if (!header) {
            // TODO: Error
            return 0;
        }
        if (flavor) {
            return header[flavor].width;
        }
        return header.width;
    }
}

function nodeHeaderHeight(headerName, flavor) { 
    return (d) => {
        var header = d.getHeader(headerName);
        if (!header) {
            // TODO: Error
            return 0;
        }
        if (flavor) {
            return header[flavor].height;
        }
        return header.height;
    }
}

function nodeHeaderText(headerName) { 
    return (d) => {
        var header = d.getHeader(headerName);
        if (!header) {
            // TODO: Error
            return '';
        }
        return header.text;
    }
}

function getNodeLogoUrl(kind) {
    return "img/entities/" + kind + ".svg";
}

// function nodeHeaderStyles(headerName) { 
//     return (d) => {
//         var header = d.getHeader(headerName);
//         return {
//             "font-family": 'Roboto',
//             "font": "14px sans-serif",
//             "font-weight": 600
//         }
//     }
// }

