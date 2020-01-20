

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
    }

    _measureText(pText, pFontSize, pStyle) {
        var lDiv = document.createElement('div');

        var parent = document.body;
        parent = document.getElementById("temporary");
    
        parent.appendChild(lDiv);
    
        if (pStyle != null) {
            lDiv.style = pStyle;
        }
        //lDiv.style.fontFamily = "Roboto";
        //lDiv.style.fontSize = "" + pFontSize + "px";
        lDiv.style.position = "absolute";
        lDiv.style.left = -1000;
        lDiv.style.top = -1000;
    
        lDiv.innerHTML = pText;
    
        var lResult = {
            width: lDiv.clientWidth,
            height: lDiv.clientHeight
        };
    
        parent.removeChild(lDiv);
        lDiv = null;
    
        return lResult;
    }

    skipShowRoot() {
        this._showRoot = false;
    }

    setup()
    {
        // var size = this._parentElem.node().getBoundingClientRect();
        // this._width = size.width;
        // this._height = size.height;

        this._svgElem = this._parentElem
            .append("svg")
            .attr("position", "absolute")
            .attr("overflow", "hidden")
            .attr("top", 0)
            .attr("left", 0)
            // .attr("right", 0)
            // .attr("bottom", 0)
            // .attr("width", this._width)
            // .attr("height", this._height)

        new ResizeSensor(jQuery(this._parentElem.node()), (size) => { 
            this.setupDimentions(size);
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

        if (this._controlInfo.previewFullRectElem)
        {
            this._controlInfo.previewFullRectElem
                .attr("width", this._visualRoot.width * this._controlInfo.scale)
                .attr("height", this._visualRoot.height * this._controlInfo.scale);
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
        this._drag = d3.drag()
            .on("start", (d) => {
                //d3.select(this).raise().attr("stroke", "black");
            })
            .on("drag", (d) => {
                this._viewX -= d3.event.dx;
                this._viewY -= d3.event.dy;
        
                this._applyPanTransform();
            })
            .on("end", (d) => {
                //d3.select(this).attr("stroke", null);
            });

        this._rootElem.call(this._drag);
        this._applyPanTransform();
    }

    _applyPanTransform()
    {
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
                d.view = self; 
                d.node = this; 
            })

        node.append("rect")
            .attr("class", "node-bg")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .style("fill", nodeBgFillColor)
            .style("stroke", function(d) { return d.strokeColor; })
            ;

        node.append("rect")
            .attr("class", "node-header")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.headerHeight; })
            .style("fill", nodeHeaderFillColor)
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node
            .append("circle")
            .attr("class", "node-logo-bg")
            .attr("transform", nodeHeaderTransform("logo", "center")) 
            .attr("r", 16)
            .style("fill", "white")
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
            .attr("transform", nodeHeaderTransform('title-kind', 'text'))  
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node.append("text")
            .attr("class", "node-title-name")
            .text(nodeHeaderText('title-name'))
            .attr("transform", nodeHeaderTransform('title-name', 'text'))  
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node
            .filter(function(d) {
                return d.hasHeader('severity');
            })
            .append("rect")
            .attr("class", "node-severity")
            .attr("x", nodeHeaderX('severity')) 
            .attr("y", nodeHeaderY('severity'))
            .attr("width", nodeHeaderWidth('severity'))
            .attr("height", nodeHeaderHeight('severity'))
            // .attr("height", 12)
            .attr("rx", 6)
            .style("fill", "red")
            // .on("click", nodePerformExpandCollapse)
            ;

        node.append("text")
            .filter(function(d) {
                return d.hasHeader('severity');
            })
            .attr("class", "node-severity-text")
            .text(nodeHeaderText('severity'))
            // .styles(nodeHeaderStyles('severity'))
            .attr("transform", nodeHeaderTransform('severity', 'text'))  
            ;

        node
            .filter(function(d) {
                return d.hasHeader('expander');
            })
            .append("image")
            .attr("class", "node-expander")
            .attr("xlink:href", nodeExpanderImage)
            .attr("x", nodeHeaderX('expander') ) 
            .attr("y", nodeHeaderY('expander'))
            .attr("width", nodeHeaderWidth('expander'))
            .attr("height", 12)
            .on("click", nodePerformExpandCollapse)
            ;

        node
            .each(function (d) { 
                for(var flag of d.flags)
                {
                    var headerName = 'flag-' + flag;
                    d3.select(d.node)
                        .append("image")
                        .attr("class", "node-flag")
                        .attr("xlink:href", nodeHeaderFlagImage(headerName))
                        .attr("x", nodeHeaderX(headerName)) 
                        .attr("y", nodeHeaderY(headerName))
                        .attr("width", nodeHeaderWidth(headerName))
                        .attr("height", nodeHeaderHeight(headerName))
                        ;                
                }
            })
    }

    _updateNode(visualNode)
    {
        var duration = 200;

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
            .attr("width", function (d) { return d.width })
            .attr("height", function (d) { return d.height })
            .style("fill", nodeBgFillColor)

        d3
            .select(visualNode.node)
            .select(".node-header")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width })
            .style("fill", nodeHeaderFillColor)

        d3
            .select(visualNode.node)
            .select(".node-expander")
            .transition()
            .duration(duration)
            .attr("x", nodeHeaderX('expander'))
            .attr("xlink:href", nodeExpanderImage)

        d3
            .select(visualNode.node)
            .select(".node-severity")
            .transition()
            .duration(duration)
            .attr("x", nodeHeaderX('severity'))

        d3
            .select(visualNode.node)
            .select(".node-severity-text")
            .transition()
            .duration(duration)
            .attr("transform", nodeHeaderTransform('severity', 'text'))  


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
                d.smallNode = this; 
            })

        node.append("rect")
            .attr("class", "node-bg")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .style("fill", nodeBgFillColor)
            ;

        node.append("rect")
            .attr("class", "node-header")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.headerHeight; })
            .style("fill", nodeHeaderFillColor)
            ;
    }

    _updateNodeSmall(visualNode)
    {
        var self = this;

        var duration = 200;

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
            .select(".node-header")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width; })
            .style("fill", nodeHeaderFillColor)
    }

    _updateNodeR(visualNode)
    {
        this._updateNode(visualNode);
        for(var child of visualNode.visibleChildren) {
            this._updateNodeR(child);
        }
    }

    _update()
    {
        this._massageSourceData();
        this._applyPanTransform();
        this._setupControl();
        this.render();
        this._updateNodeR(this._visualRoot);
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
        this._update();
        
        if (childParts.length == 0) {
            this.selectNode(visualNode);
            this._update();

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
    d.view._update();
}

function nodePerformSelect(d)
{
    d.view.selectNode(d);
}

function nodeHeaderFillColor(d)
{
    return d.headerFillColor;
}

function nodeBgFillColor(d)
{
    return d.bgFillColor;
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
            return "";
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

function nodeHeaderWidth(headerName) { 
    return (d) => {
        var header = d.getHeader(headerName);
        return header.width;
    }
}

function nodeHeaderHeight(headerName) { 
    return (d) => {
        var header = d.getHeader(headerName);
        return header.height;
    }
}

function nodeHeaderText(headerName) { 
    return (d) => {
        var header = d.getHeader(headerName);
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

