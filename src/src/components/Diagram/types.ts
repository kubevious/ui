import { FontSpec } from "../../types"
import { VisualNode } from "./visual-node/visual-node"

export enum NODE_RENDER_METADATA_NAME {
    arrange = "arrange",
    padding = "padding",
    expanded = "expanded",
}

export type Block = {
    w: number
    h: number
    fit?: {
        x: number
        y: number
    }
    item: VisualNode
}

export type Coordinates = {
    x: number
    y: number
    w: number
    h: number
}

export interface NodeDiagrams extends Coordinates {
    used?: boolean
    right?: Coordinates
    down?: Coordinates
}

export interface Header {
    id?: string
    name?: string
    kind?: string
    location?: string
    width?: number
    height?: number
    padding?: number
    text?: string | number
    left?: number
    fontSpec?: FontSpec
    right?: number
    centerY?: number
    top?: number
    bounding?: {
        height?: number
        sidesPadding: number
        width?: number
        left?: number
        right?: number
        centerY?: number
        top?: number
    }
    icon?: string
    cells?: Header[]
}

export type ViewPosition = {
    x: number
    y: number
}

export type ControlInfo = {
    previewGroupElem: {
        _groups: any[] //html elem
        _parents: any[] //html elem
    }
    previewFullRectElem: {
        _groups: any[] //html elem
        _parents: any[] //html elem
    }
    previewItemsGroupElem: {
        _groups: any[] //html elem
        _parents: any[] //html elem
    }
    previewVisibleRectElem: {
        _groups: any[] //html elem
        _parents: any[] //html elem
    }
    boxWidth: number
    boxHeight: number
    scale: number
    x: number
    y: number
}
