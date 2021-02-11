import { Montserrat } from "../../types"
import VisualNode from "./visual-node/visual-node"

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
    fontSpec?: Montserrat
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
