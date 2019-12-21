
var color = d3.scaleOrdinal(d3.schemeTableau10);//schemeTableau10

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

        // this.setupDimentions();

        this._rootElem = this._svgElem.append("g");
        
        this._renderControl();

        this._setupPanning();
    }

    _renderControl()
    {
        this._controlInfo.groupElem = this._svgElem.append("g")
            .attr("class", "control")
            .attr("fill-opacity", "0.5")

        this._controlInfo.fullRectElem = this._controlInfo.groupElem
            .append("rect")
            .style("fill", "green");

        this._controlInfo.smallDiagRootElem = this._controlInfo.groupElem
            .append("g");

        this._controlInfo.visibleRectElem = this._controlInfo.groupElem
            .append("rect")
            .style("fill", "blue");
    }

    setupDimentions()
    {
        var size = this._parentElem.node().getBoundingClientRect();
        this._width = size.width;
        this._height = size.height;

        if (this._svgElem) 
        {
            this._svgElem
                .attr("width", this._width)
                .attr("height", this._height - 10);
        }

        this._setupControl();
    }

    _setupControl()
    {
        if (!this._visualRoot) {
            return;
        }

        this._controlInfo.isReady = true;
        
        var boxScale = 5
        this._controlInfo.width = this._width / boxScale;
        this._controlInfo.height = this._height / boxScale;

        this._controlInfo.scale = Math.max(
            this._visualRoot.width / this._controlInfo.width,
            this._visualRoot.height / this._controlInfo.height) * 2;
//        this._controlInfo.scale = 5;

        this._controlInfo.x = this._width - this._controlInfo.width - 20;
        this._controlInfo.y = this._height - this._controlInfo.height - 20;

        if (this._controlInfo.groupElem)
        {
            this._controlInfo.groupElem.attr("transform", (d) => { 
                return "translate(" + this._controlInfo.x + "," + this._controlInfo.y+ ")"; 
            })
        }

        if (this._controlInfo.fullRectElem)
        {
            this._controlInfo.fullRectElem
                .attr("width", this._controlInfo.width)
                .attr("height", this._controlInfo.height);
        }

        if (this._controlInfo.visibleRectElem) {
            this._controlInfo.visibleRectElem
                .attr("x", - this._viewX / this._controlInfo.scale)
                .attr("y", - this._viewY / this._controlInfo.scale)
                .attr("width", this._width / this._controlInfo.scale)
                .attr("height", this._height / this._controlInfo.scale);
        }

        this._renderSmallItems();
    }

    _setupPanning()
    {
        this._drag = d3.drag()
            .on("start", (d) => {
                //d3.select(this).raise().attr("stroke", "black");
            })
            .on("drag", (d) => {
                this._viewX += d3.event.dx;
                this._viewY += d3.event.dy;
        
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
        this._rootElem.attr("transform", (d) => { 
            return "translate(" + this._viewX + "," + this._viewY + ")"; 
        })

        this._setupControl();
    }

    acceptSourceData(sourceData)
    {
        this._visualRoot = this._packSourceData(sourceData);
        this._massageSourceData();
    }

    _packSourceData(root) {
        var i = 0;
        var recurse = (node) => {
            var visualNode = new VisualNode(this, node);
            visualNode._id = i;
            i++;
            if (!node.children) {
                node.children = [];
            }
            for(var child of node.children) {
                var visualChild = recurse(child);
                visualNode.addChild(visualChild);
            }
            visualNode.prepare();
            return visualNode;
        }

        return recurse(root);
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
        this._renderItemsSmall(this._controlInfo.smallDiagRootElem, this._flatVisualNodes);
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
            .attr("class", "node")
            .attr("id", function(d) { 
                return d.id; 
            })
            .attr("transform", nodeGroupTransform)
            .each(function(d) { 
                d.view = self; 
                d.node = this; 
            })

        node.append("rect")
            .attr("class", "bg")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return d.height; })
            .style("fill", function(d) { 
                var x = color(d.depth); 
                x = pSBC(0.75, x, false, true);
                return x;
            })
            .style("stroke", function(d) { 
                var x = color(d.depth); 
                x = pSBC(-0.50, x, false, true);
                return x;
            })
            ;

        node.append("rect")
            .attr("class", "header")
            .attr("width", function(d) { return d.width; })
            .attr("height", function(d) { return 34; })
            .style("fill", nodeHeaderFillColor)
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node
            .append("circle")
            .attr("class", "logo-bg")
            .attr("transform", nodeHeaderTransform('logo', 'center')) 
            .attr("r", 12)
            .style("fill", "white")
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node
            .append("image")
            .attr("class", "logo")
            .attr("xlink:href", function(d) {
                return "img/entities/" + d.data.kind + ".svg";
            })
            .attr("x", nodeHeaderX('logo'))
            .attr("y", nodeHeaderY('logo'))
            .attr("width", 24)
            .attr("height", 24)
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node.append("text")
            .attr("class", "title text-light")
            .text(nodeHeaderText('title'))
            .attr("transform", nodeHeaderTransform('title', 'text'))  
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;

        node
            .filter(function(d) {
                return d.hasHeader('severity');
            })
            .append("rect")
            .attr("class", "severity")
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
            .attr("class", "severity-text text-light")
            .text(nodeHeaderText('severity'))
            // .styles(nodeHeaderStyles('severity'))
            .attr("transform", nodeHeaderTransform('severity', 'text'))  
            ;

        node
            .filter(function(d) {
                return d.hasHeader('expander');
            })
            .append("image")
            .attr("class", "expandr")
            .attr("xlink:href", nodeExpanderImage)
            .attr("x", nodeHeaderX('expander') ) 
            .attr("y", nodeHeaderY('expander'))
            .attr("width", nodeHeaderWidth('expander'))
            .attr("height", 12)
            .on("click", nodePerformExpandCollapse)
            ;
    }

    _updateNode(visualNode)
    {
        var duration = 200;

        d3
            .select(visualNode.node)
            .transition()
            .duration(duration)
            .attr("transform", nodeGroupTransform)

        d3
            .select(visualNode.node)
            .select(".bg")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width })
            .attr("height", function (d) { return d.height })

        d3
            .select(visualNode.node)
            .select(".header")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width })
            .style("fill", nodeHeaderFillColor)

        d3
            .select(visualNode.node)
            .select(".expandr")
            .transition()
            .duration(duration)
            .attr("x", nodeHeaderX('expander'))
            .attr("xlink:href", nodeExpanderImage)

        d3
            .select(visualNode.node)
            .select(".severity")
            .transition()
            .duration(duration)
            .attr("x", nodeHeaderX('severity'))

        d3
            .select(visualNode.node)
            .select(".severity-text")
            .transition()
            .duration(duration)
            .attr("transform", nodeHeaderTransform('severity', 'text'))  


        this._updateNodeSmall(visualNode);
    }

    _renderItemsSmall(parentNode, items)
    {
        var self = this;
        if (!this._controlInfo.isReady) {
            return;
        }
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
            .attr("transform", smallNodeGroupTransform)
            .each(function(d) { 
                d.smallNode = this; 
            })

        node.append("rect")
            .attr("class", "bg")
            .attr("width", function(d) { return d.width / self._controlInfo.scale; })
            .attr("height", function(d) { return d.height / self._controlInfo.scale; })
            .style("fill", function(d) { 
                var x = color(d.depth); 
                x = pSBC(0.75, x, false, true);
                return x;
            })
            .style("stroke", function(d) { 
                var x = color(d.depth); 
                x = pSBC(-0.50, x, false, true);
                return x;
            })
            ;

        node.append("rect")
            .attr("class", "header")
            .attr("width", function(d) { return d.width / self._controlInfo.scale; })
            .attr("height", function(d) { return 34 / self._controlInfo.scale; })
            .style("fill", nodeHeaderFillColor)
            .on("click", nodePerformSelect)
            .on("dblclick", nodePerformExpandCollapse)
            ;
    }

    _updateNodeSmall(visualNode)
    {
        if (!this._controlInfo.isReady) {
            return;
        }

        var self = this;

        var duration = 200;

        d3
            .select(visualNode.smallNode)
            .transition()
            .duration(duration)
            .attr("transform", smallNodeGroupTransform)

        d3
            .select(visualNode.smallNode)
            .select(".bg")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width / self._controlInfo.scale; })
            .attr("height", function (d) { return d.height / self._controlInfo.scale; })

        d3
            .select(visualNode.smallNode)
            .select(".header")
            .transition()
            .duration(duration)
            .attr("width", function (d) { return d.width / self._controlInfo.scale; })
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
    var x = color(d.depth); 

    if (d.isSelected) {
        x = pSBC(-0.5, x, false, true);
    // return "red";
    }

    // x = pSBC(-0.25, x, false, true);

    return x;
}

function nodeGroupTransform(d) { 
    return "translate(" + d.absX + "," + d.absY + ")"; 
}

function smallNodeGroupTransform(d) { 
    if (!d.view._controlInfo.isReady) {
        return "";
    }
    return "translate(" + (d.absX / d.view._controlInfo.scale) + "," + (d.absY / d.view._controlInfo.scale) + ")"; 
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



const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
5