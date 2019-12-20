class VisualNode {

    constructor(view, data) {
        this._view = view;
        this._data = data;
        this._parent = null;
        this._children = [];
        this._id = null;
        this._x = 0; //relative to parent
        this._y = 0; //relative to parent
        this._absX = 0; 
        this._absY = 0; 
        this._width = 0;
        this._height = 0;

        this._padding = this._resolveValue("padding");
        this._paddingLeft = this._resolveValue("paddingLeft");

        this._headerHeight = 34; //50;
        this._isExpanded = this._resolveValue("expanded");
        this._isSelected = false;
    }

    get id() {
        return this._id;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get absX() {
        return this._absX;
    }

    get absY() {
        return this._absY;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get depth() {
        if (this._parent) {
            return this._parent.depth + 1;
        }
        return 1;
    }

    get data() {
        return this._data;
    }

    get isExpanded() {
        return this._isExpanded;
    } 

    set isExpanded(value) {
        this._isExpanded = value;
    } 

    get isSelected() {
        return this._isSelected;
    } 

    set isSelected(value) {
        this._isSelected = value;
    }

    get visibleChildren() {
        if (this.isExpanded) {
            return this._children;
        }
        return [];
    }

    get hasChildren() {
        return this._children.length > 0;
    }

    get isExpandable() {
        return this.hasChildren;
    }

    get parent() {
        return this._parent;
    }

    addChild(child) {
        child._parent = this;
        this._children.push(child);
    }

    prepare() {
        this._sortChildren();
    }

    _sortChildren() {
        var result = [];
        var groups = _.groupBy(this._children, x => x.data.order);
        var groupIds = _.keys(groups);
        groupIds = _.orderBy(groupIds, x => parseInt(x));
        for(var x of groupIds) {
            var innerList = groups[x];
            innerList = _.orderBy(innerList, x => x.data.rn);
            result = _.concat(result, innerList);
        }
        this._children = result;
    }

    measureAndArrange() {

        var titleDimentions = 
            this._view._measureText(this.data.name, null, "font-family: 'Roboto'; font: 14px sans-serif; font-weight: 600;");
        var minWidth = 5 + 24 + 5 + titleDimentions.width + 5;
        if (this.hasChildren) {
            minWidth += 5 + 12 + 5;
        }

        this._x = 0;
        this._y = 0;
        this._width = minWidth;
        this._height = this._headerHeight;

        if (this.visibleChildren.length == 0) {
            return;
        }
        
        for(var child of this.visibleChildren) {
            child.measureAndArrange();
        }

        if (this._getIsArrangedVertically()) {
            this._arrangeChildrenVertically();
        } else {
            this._arrangeChildrenHorizontally();
        }

        for(var component of this._getInnerCompontents())
        {
            this._width = Math.max(this._width, component.x + component.width + this._padding);
            this._height = Math.max(this._height, component.y + component.height + this._padding);
        }

        this._fitChildrenWidthToParent();
    }

    _resolveValue(name) {
        return resolveValue(name, this.data.kind);
    }

    _getIsArrangedVertically() {
        if (this._resolveValue("arrangeVertically")) {
            return true;
        }
        return false;
    }

    _arrangeChildrenHorizontally()
    {
        var i = this._paddingLeft;
        for(var child of this.visibleChildren) {
            child._x = i;
            child._y = this._headerHeight + this._padding;
            i += child.width + this._padding;
        }
    }

    _arrangeChildrenVertically()
    {
        var i = this._headerHeight + this._padding;
        for(var child of this.visibleChildren) {
            child._x = this._paddingLeft;
            child._y = i;
            i += child.height + this._padding;
        }
    }

    _fitChildrenWidthToParent()
    {
        if (!this._getIsArrangedVertically()) {
            return;
        }

        for(var child of this.visibleChildren) {
           child._width = this._width - this._paddingLeft - this._padding;
           child._fitChildrenWidthToParent();
        }
    }

    _getInnerCompontents()
    {
        return this.visibleChildren;
    }

    calculateAbsolutePos() {
        if (this._parent) {
            this._absX = this._parent.absX + this._x; 
            this._absY = this._parent.absY + this._y; 
        } else {
            this._absX = this._x; 
            this._absY = this._y; 
        }
        for(var child of this.visibleChildren) {
            child.calculateAbsolutePos();
        }
    }

    extract() {
        var nodes = [];
      
        function recurse(node) {
            nodes.push(node);
            for(var child of node.visibleChildren) {
                recurse(child);
            }
        }
    
        recurse(this);
      
        return nodes;
    }
}

const NODE_RENDER_METADATA = {
    default: {
        arrangeVertically: false,
        padding: 5,
        paddingLeft: 30,
        expanded: false
    },
    per_kind: {
        root: {
            padding: 30,
            expanded: true
        },
        ns: {
            arrangeVertically: true,
            expanded: true,
            padding: 20
        },
        app: {
            arrangeVertically: true,
            padding: 5
        },
        raw: {
            arrangeVertically: true,
            padding: 5
        }
    }
}

function resolveValue(name, kind)
{
    var valuesDefault = NODE_RENDER_METADATA.default;
    var valuesKind = NODE_RENDER_METADATA.per_kind[kind];

    var values = _.cloneDeep(valuesDefault);
    if (valuesKind) {
        values = _.defaults(valuesKind, values);
    }

    return values[name];
}