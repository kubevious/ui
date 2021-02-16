import _ from "the-lodash"
import { GrowingPacker } from "../packer.growing"
import { prettyKind } from "../../../utils/ui-utils"
import {
    MONTSERRAT_12PX_500,
    MONTSERRAT_10PX_500,
    MONTSERRAT_14PX_500,
} from "../../../utils/constants"
import {
    NODE_RENDER_METADATA,
    SEVERITY_BG_COLOR_ERROR,
    SEVERITY_BG_COLOR_WARN,
    VISUAL_NODE_COLOR_TABLE,
} from "../constants"
import { VisualView } from "../visual-view/visual-view"
import { DiagramData, Flags } from "../../../types"
import { NODE_RENDER_METADATA_NAME, Header, Block } from "../types"
import { VisualNodeHeaderExpander } from "./visual-node-header-expander"
import { VisualNodeHeaderFlag } from "./visual-node-header-flag"
import { VisualNodeHeaderMarker } from "./visual-node-header-marker"
import { VisualNodeSeverity } from "./visual-node-severity"
import { VisualNodeText } from "./visual-node-text"

export class VisualNode {
    private _view: VisualView
    private _data: DiagramData
    private _parent: VisualNode | null
    private _children: VisualNode[]
    private _x: number
    private _y: number
    private _absX: number
    private _absY: number
    private _width: number
    private _height: number
    private _padding: number
    private _paddingLeft: number
    private _headerPadding: number
    private _headerWidth: number
    private _headerHeight: number
    private _depth: number
    private _expanderNodes: VisualNodeHeaderExpander[]
    private _flagNodes: VisualNodeHeaderFlag[]
    private _markerNodes: VisualNodeHeaderMarker[]
    private _severityNodes: VisualNodeSeverity[]
    private _severityTextNodes: VisualNodeText[]
    private _selectedHeaderFillColor!: string
    private _headerFillColor!: string
    private _headerBgFillColor!: string
    private _selectedBgFillColor!: string
    private _bgFillColor!: string
    private _selectedStrokeColor!: string
    private _strokeColor!: string
    private _headers: Header
    private _headersOrder: Header[]

    constructor(
        view: VisualView,
        data: DiagramData,
        parent: VisualNode | null
    ) {
        if (!view) {
            throw new Error("View Not Set")
        }
        this._view = view
        this._data = data
        this._parent = parent
        this._children = []
        this._x = 0
        this._y = 0
        this._absX = 0
        this._absY = 0
        this._width = 0
        this._height = 0

        this._padding = Number(
            this._resolveValue(NODE_RENDER_METADATA_NAME.padding)
        )
        this._paddingLeft = this._padding //this._resolveValue("paddingLeft");

        this._headerPadding = 5
        this._headerWidth = 0
        this._headerHeight = 40

        if (this._parent) {
            this._parent._children.push(this)
            this._depth = this._parent.depth + 1
        } else {
            this._depth = -1
        }

        this._expanderNodes = []
        this._flagNodes = []
        this._markerNodes = []
        this._severityNodes = []
        this._severityTextNodes = []

        this._headers = {}
        this._headersOrder = []
        this._setupTheme()
    }

    get view(): VisualView {
        return this._view
    }

    get node(): VisualNode {
        return this.view.d3NodeDict[this.id]
    }

    get smallNode() {
        return this.view.d3SmallNodeDict[this.id]
    }

    get id(): string {
        return this._data.dn || ""
    }

    get x(): number {
        return this._x
    }

    get y(): number {
        return this._y
    }

    get absX(): number {
        return this._absX
    }

    get absY(): number {
        return this._absY
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    get headerHeight(): number {
        return this._headerHeight
    }

    get depth(): number {
        return this._depth
    }

    get data(): DiagramData {
        return this._data
    }

    get flags(): Flags {
        if (!this.data.flags) {
            return []
        }
        if (_.isPlainObject(this.data.flags)) {
            return _.keys(this.data.flags)
        }
        return this.data.flags
    }

    get markers(): string[] {
        if (!this.data.markers) {
            return []
        }
        return this.data.markers
    }

    get expanderNodes(): VisualNodeHeaderExpander[] {
        return this._expanderNodes
    }

    get flagNodes(): VisualNodeHeaderFlag[] {
        return this._flagNodes
    }

    get markerNodes(): VisualNodeHeaderMarker[] {
        return this._markerNodes
    }

    get severityNodes(): VisualNodeSeverity[] {
        return this._severityNodes
    }

    get severityTextNodes(): VisualNodeText[] {
        return this._severityTextNodes
    }

    get isExpanded(): boolean {
        return this.view.getExpanded(this.id)
    }

    set isExpanded(value: boolean) {
        this.view.setExpanded(this.id, value)
    }

    get isSelected(): boolean {
        return this.id === this.view.currentSelectedNodeDn
    }

    get visibleChildren(): VisualNode[] {
        if (this.isExpanded) {
            return this._children
        }
        return []
    }

    get hasChildren(): boolean {
        return this._data.childrenCount > 0
    }

    get isExpandable(): boolean {
        return this.hasChildren
    }

    get parent(): VisualNode | null {
        return this._parent
    }

    get errorCount(): number {
        return this._getAlertCount("error")
    }

    get warnCount(): number {
        return this._getAlertCount("warn")
    }

    _getAlertCount(severity: string): number {
        if (this.data.alertCount) {
            return this.data.alertCount[severity]
        }
        return 0
    }

    get headerFillColor(): string {
        if (this.isSelected) {
            return this._selectedHeaderFillColor
        }
        return this._headerFillColor
    }

    get headerBgFillColor(): string {
        return this._headerBgFillColor
    }

    get bgFillColor(): string {
        if (this.isSelected) {
            return this._selectedBgFillColor
        }
        return this._bgFillColor
    }

    get strokeColor(): string {
        if (this.isSelected) {
            return this._selectedStrokeColor
        }
        return this._strokeColor
    }

    prepare(): void {
        this._sortChildren()
        this._determineHeader()
    }

    findChildByRn(rn: string): VisualNode | null {
        for (let x of this._children) {
            if (x.data.rn === rn) {
                return x
            }
        }
        return null
    }

    _determineHeader(): void {
        this._headers = {}
        this._headersOrder = []

        {
            var size = 32
            this._addToHeader("logo", {
                kind: "fixed",
                location: "left",
                width: size,
                height: size,
                padding: (this._headerHeight - size) / 2 - this._headerPadding,
            })
        }

        this._addToHeader("title", {
            kind: "column",
            location: "left",
            padding: 5,
            cells: [
                {
                    name: "kind",
                    kind: "text",
                    text: prettyKind(this.data.kind || ""),
                    fontSpec: MONTSERRAT_10PX_500,
                },
                {
                    name: "name",
                    kind: "text",
                    text: this.data.name,
                    fontSpec: MONTSERRAT_14PX_500,
                },
            ],
        })

        if (this.isExpandable) {
            // eslint-disable-next-line no-redeclare
            var size = 20
            this._addToHeader("expander", {
                kind: "fixed",
                location: "right",
                width: size,
                height: size,
                padding: (this._headerHeight - size) / 2 - this._headerPadding,
            })

            this._expanderNodes = [
                new VisualNodeHeaderExpander(this, "expander"),
            ]
        } else {
            this._expanderNodes = []
        }

        this._severityNodes = []
        this._severityTextNodes = []

        if (this.warnCount) {
            this._addToHeader("warns", {
                kind: "text",
                text: this.warnCount,
                fontSpec: MONTSERRAT_12PX_500,
                location: "right",
                bounding: {
                    height: 20,
                    sidesPadding: 8,
                },
            })

            this._severityNodes.push(
                new VisualNodeSeverity(
                    this,
                    "warns",
                    "bounding",
                    SEVERITY_BG_COLOR_WARN
                )
            )
            this._severityTextNodes.push(new VisualNodeText(this, "warns"))
        }

        if (this.errorCount) {
            this._addToHeader("errors", {
                kind: "text",
                text: this.errorCount,
                fontSpec: MONTSERRAT_12PX_500,
                location: "right",
                bounding: {
                    height: 20,
                    sidesPadding: 8,
                },
            })

            this._severityNodes.push(
                new VisualNodeSeverity(
                    this,
                    "errors",
                    "bounding",
                    SEVERITY_BG_COLOR_ERROR
                )
            )
            this._severityTextNodes.push(new VisualNodeText(this, "errors"))
        }

        for (var flag of this.flags) {
            this._addToHeader("flag-" + flag, {
                kind: "icon",
                icon: flag,
                location: "right",
            })
        }
        this._flagNodes = this.flags.map(
            (x: string) => new VisualNodeHeaderFlag(this, x)
        )

        for (var marker of this.markers) {
            this._addToHeader("marker-" + marker, {
                kind: "marker",
                icon: marker,
                location: "right",
            })
        }
        this._markerNodes = this.markers.map(
            (x) => new VisualNodeHeaderMarker(this, x)
        )

        this._measureHeaders()
    }

    _measureHeaders(): void {
        var left = this._headerPadding //this._paddingLeft;
        var right = this._headerPadding //this._padding;
        for (var header of this._headersOrder) {
            this._measureHeader(header)

            if (header.bounding) {
                if (header.location === "left") {
                    if (header.padding) {
                        left += header.padding
                    }
                    header.bounding.left = left
                    header.left = header.bounding.left
                    if (header.bounding.sidesPadding) {
                        header.left += header.bounding.sidesPadding
                    }
                    if (header.bounding.width) {
                        left += header.bounding.width
                        left += this._headerPadding
                    }
                } else if (header.location === "right") {
                    if (header.padding) {
                        right += header.padding
                    }
                    if (header.bounding.width) {
                        right += header.bounding.width
                        header.bounding.right = right
                    }
                    header.right = header.bounding.right
                    if (header.bounding.sidesPadding && header.right) {
                        header.right -= header.bounding.sidesPadding
                    }
                    right += this._headerPadding
                }
                if (header.bounding.height) {
                    header.bounding.centerY =
                        (this._headerHeight + header.bounding.height) / 2
                    header.bounding.top =
                        (this._headerHeight - header.bounding.height) / 2
                }
            } else {
                if (header.location === "left") {
                    if (header.padding) {
                        left += header.padding
                    }
                    if (header.width) {
                        header.left = left
                        left += header.width
                        left += this._headerPadding
                    }
                } else if (header.location === "right") {
                    if (header.padding) {
                        right += header.padding
                    }
                    if (header.width) {
                        right += header.width
                        header.right = right
                        right += this._headerPadding
                    }
                }
            }
            const h = header.height || 40 // min height

            if (!header.centerY) {
                header.centerY = (this._headerHeight + h) / 2
            }
            header.top = (this._headerHeight - h) / 2

            if (header.kind === "column" && header.cells) {
                var top = header.top
                for (var cell of header.cells) {
                    cell.top = top
                    cell.left = header.left
                    cell.right = header.right
                    if (cell.height) {
                        top += cell.height
                    }
                }
            }
        }
        this._headerWidth = left + right
    }

    hasHeader(name: string): boolean {
        if (this.getHeader(name)) {
            return true
        }
        return false
    }

    getHeader(name: string): Header | null {
        var header = this._headers[name]
        if (!header) {
            return null
        }
        return header
    }

    getHeaderX(name: string, flavor?: string): number {
        var header = this.getHeader(name)
        if (!header) {
            // TODO: Error
            return 0
        }
        var value = 0
        if (header.location === "left" && header.left) {
            value = header.left
        } else if (header.location === "right" && header.right) {
            value = this.width - header.right
        }
        if (flavor === "center" && header.width) {
            value += header.width / 2
        }
        if (flavor === "bounding" && header.bounding) {
            if (header.location === "left" && header.bounding.left) {
                value = header.bounding.left
            } else if (header.location === "right" && header.bounding.right) {
                value = this.width - header.bounding.right
            }
        }

        return value
    }

    getHeaderY(name: string, flavor?: string): number {
        var header = this.getHeader(name)
        if (!header) {
            // TODO: Error
            return 0
        }
        const top = header.top
        const centerY = header.centerY
        const height = header.height
        const boundingTop = header.bounding?.top
        if (flavor === "center" && centerY) {
            return centerY
        }
        if (flavor === "bounding" && boundingTop) {
            return boundingTop
        }
        if (header.kind === "text" && top && height) {
            return top + height / 2 + height / 4
        }
        return top || 0
    }

    getHeaderCenterX(name: string): number {
        var header = this.getHeader(name)
        if (!header || !header.width) {
            // TODO: Error
            return 0
        }
        const width = header.width
        return this.getHeaderX(name) + width / 2
    }

    getHeaderCenterY(name: string): number {
        var header = this.getHeader(name)
        if (!header || !header.top || !header.height) {
            // TODO: Error
            return 0
        }
        const height = header.height
        const top = header.top
        return top + height / 2
    }

    _measureHeader(header: Header): void {
        if (header.kind === "column" && header.cells) {
            for (var cell of header.cells) {
                this._measureHeader(cell)
            }
            header.width = _.max(header.cells.map((x) => x.width))
            header.height = _.sumBy(header.cells, (x: Header) => x.height || 0)
        } else if (header.kind === "text") {
            var textDimentions = this._view._measureText(
                header.text,
                header.fontSpec
            )
            header.width = textDimentions.width
            header.height = textDimentions.height
        } else if (header.kind === "icon") {
            header.width = 16
            header.height = 16
        } else if (header.kind === "marker") {
            header.width = 20
            header.height = 20
        }

        if (header.bounding && header.width) {
            const width = header.width
            if (!header.bounding.height) {
                header.bounding.height = header.height
            }
            if (!header.bounding.width) {
                header.bounding.width = width
            }
            if (header.bounding.sidesPadding) {
                header.bounding.width = width + header.bounding.sidesPadding * 2
                header.width = width
                header.width += header.bounding.sidesPadding * 2
            }
        }
    }

    _addToHeader(name: string, info: Header): void {
        info.id = name
        info.name = info.id
        this._headers[name] = info
        this._headersOrder.push(info)

        if ((info.kind === "column", info.cells)) {
            for (var cell of info.cells) {
                cell.id = name + "-" + cell.name
                cell.location = info.location
                this._headers[cell.id] = cell
            }
        }
    }

    _sortChildren(): void {
        var result: VisualNode[] = []
        var groups = _.groupBy(this._children, (x: VisualNode) => x.data.order)
        var groupIds = _.keys(groups)
        groupIds = _.orderBy(groupIds, (x: string) => parseInt(x))
        for (var x of groupIds) {
            var innerList = groups[x]
            innerList = _.orderBy(innerList, (x: VisualNode) => x.data.rn)
            result = _.concat(result, innerList)
        }
        this._children = result
    }

    measureAndArrange(): void {
        this._x = 0
        this._y = 0
        this._width = this._headerWidth
        this._height = this._headerHeight

        if (this.visibleChildren.length === 0) {
            return
        }

        for (var child of this.visibleChildren) {
            child.measureAndArrange()
        }

        if (this._getIsArrangedVertically()) {
            this._arrangeChildrenVertically()
        } else if (this._getIsArrangedHorizontally()) {
            this._arrangeChildrenHorizontally()
        } else if (this._getIsArrangedPack()) {
            this._arrangeChildrenPack()
        }

        for (var component of this._getInnerCompontents()) {
            this._width = Math.max(
                this._width,
                component.x + component.width + this._padding
            )
            this._height = Math.max(
                this._height,
                component.y + component.height + this._padding
            )
        }

        this._fitChildrenWidthToParent()
    }

    _resolveValue(name: string) {
        return resolveValue(NODE_RENDER_METADATA_NAME[name], this.data.kind)
    }

    _getIsArrangedVertically(): boolean {
        if (
            this._resolveValue(NODE_RENDER_METADATA_NAME.arrange) ===
            "vertically"
        ) {
            return true
        }
        return false
    }

    _getIsArrangedHorizontally(): boolean {
        if (
            this._resolveValue(NODE_RENDER_METADATA_NAME.arrange) ===
            "horizontally"
        ) {
            return true
        }
        return false
    }

    _getIsArrangedPack(): boolean {
        if (this._resolveValue(NODE_RENDER_METADATA_NAME.arrange) === "pack") {
            return true
        }
        return false
    }

    _arrangeChildrenHorizontally(): void {
        var i = this._paddingLeft
        for (var child of this.visibleChildren) {
            child._x = i
            child._y = this._headerHeight + this._padding
            i += child.width + this._padding
        }
    }

    _arrangeChildrenVertically(): void {
        var i = this._headerHeight + this._padding
        for (var child of this.visibleChildren) {
            child._x = this._paddingLeft
            child._y = i
            i += child.height + this._padding
        }
    }

    _arrangeChildrenPack(): void {
        var packer = new GrowingPacker()
        var blocks: Block[] = this.visibleChildren.map((x) => ({
            w: x.width + this._padding,
            h: x.height + this._padding,
            item: x,
        }))
        blocks = _.orderBy(blocks, (x: Block) => Math.max(x.h, x.w), "desc")

        packer.fit(blocks)

        for (var block of blocks) {
            if (block.fit) {
                block.item._x = this._paddingLeft + block.fit.x
                block.item._y = this._headerHeight + this._padding + block.fit.y
            } else {
                console.log("DOES NOT FIT")
            }
        }
    }

    _fitChildrenWidthToParent(): void {
        if (!this._getIsArrangedVertically()) {
            return
        }

        for (var child of this.visibleChildren) {
            child._width = this._width - this._paddingLeft - this._padding
            child._fitChildrenWidthToParent()
        }
    }

    _getInnerCompontents(): VisualNode[] {
        return this.visibleChildren
    }

    calculateAbsolutePos(): void {
        if (this._parent) {
            this._absX = this._parent.absX + this._x
            this._absY = this._parent.absY + this._y
        } else {
            this._absX = this._x
            this._absY = this._y
        }
        for (var child of this.visibleChildren) {
            child.calculateAbsolutePos()
        }
    }

    autoexpand(): VisualNode[] {
        var nodes: VisualNode[] = []

        let recurse = function (node: VisualNode) {
            if (!node.view.existingNodeIds[node.id]) {
                node.view.existingNodeIds[node.id] = true
                if (node._resolveValue(NODE_RENDER_METADATA_NAME.expanded)) {
                    node.isExpanded = true
                }
            }

            for (var child of node._children) {
                recurse(child)
            }
        }

        recurse(this)

        return nodes
    }

    extract(): VisualNode[] {
        var nodes: VisualNode[] = []

        let recurse = function (node: VisualNode) {
            nodes.push(node)
            for (var child of node.visibleChildren) {
                recurse(child)
            }
        }

        recurse(this)

        return nodes
    }

    _setupTheme(): void {
        var x =
            VISUAL_NODE_COLOR_TABLE[this.depth % VISUAL_NODE_COLOR_TABLE.length]
        this._headerFillColor = x
        this._headerBgFillColor = "#35373E"
        this._bgFillColor = "#252526"
        this._strokeColor = "#35373E"

        this._selectedHeaderFillColor = "#FCBD3F"
        this._selectedBgFillColor = "#43454D"
        this._selectedStrokeColor = this._selectedHeaderFillColor
    }
}

/*
'arrange': 
    return string
'padding': 
    return number
'expanded': 
    return boolean
*/
function resolveValue(name: NODE_RENDER_METADATA_NAME, kind: string = "") {
    var valuesDefault = NODE_RENDER_METADATA.default
    var valuesKind = NODE_RENDER_METADATA.per_kind[kind]

    var values = _.cloneDeep(valuesDefault)
    if (valuesKind) {
        values = _.defaults(valuesKind, values)
    }

    switch (name) {
        case NODE_RENDER_METADATA_NAME.arrange:
            return values.arrange
        case NODE_RENDER_METADATA_NAME.padding:
            return values.padding
        case NODE_RENDER_METADATA_NAME.expanded:
            return values.expanded
    }
}
