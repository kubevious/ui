import { EditorItem } from "./components/Editors/types"

export type Service = new (...args: any) => Service

export type AlertCount = {
    error?: number
    warn?: number
}

export type Flags = string[]

export interface SelectedData {
    dn: string
    id?: number
    errors?: number
    warnings?: number
    options?: DnOptions
    markers?: string[]
}

export type Markers = {
    kind: string
    items: EditorItem[]
}

export interface DiagramData {
    flags?: Flags
    dn?: string
    rn?: string
    kind?: string
    order?: number
    alertCount?: AlertCount
    errorCount?: number
    children: DiagramData[]
    markers?: string[]
    childrenCount: number
    name?: string
}

export type FontSpec = {
    defaultWidth: number
    height: number
    startCode: number
    widths: number[]
}

export interface PersistableFields {
    selected_dn?: string
    time_machine_enabled?: boolean
    time_machine_target_date?: Date
    time_machine_date_to?: Date
    time_machine_duration?: number
}

export type PersistableParams = {
    sd?: string | null
    tme?: string | null
    tmtd?: string | null
    tmdt?: string | null
    tmd?: string | null
}

export type Alert = {
    source: {
        id: string
        kind: string
    }
    msg: string
    severity: string
    id?: string
    dn?: string
    uiKey?: string
}

export type Dn = {
    dn?: string
    alertCount?: AlertCount
}

export interface TopIssueNamespaces {
    kind: string
    id: string
    title: string
    order: number
    config: Dn[]
}

export type Group = {
    id: string
    title?: string
    kind: string
    config: any
    order?: number
    options: string[]
}

export type DnOptions = {
    relativeTo?: string
}
