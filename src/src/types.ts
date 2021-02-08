export type Service = new (...args: any) => Service;

export type AlertCount = {
    error?: number,
    warn?: number
}

export type Flag = {
    propagatable?: boolean,
    name: string
}

export type Flags = {
    shared: Flag,
    xnamespace: Flag,
    radioactive: Flag,

}

export type DiagramDataItem = {
    rn: string,
    name: string,
    kind: string,
    order?: number,
    alertCount?: AlertCount,
    errorCount: number,
    flags?: Flags,
    children?: DiagramDataItem[]
}

export type Coordinates = {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface NodeDiagrams extends Coordinates {
    used?: boolean;
    right?: Coordinates,
    down?: Coordinates,
}

export type Block = {
    w: number,
    h: number,
    fit: {
        x: number,
        y: number
    }
}



export interface DiagramData {
    dn?: string,
    rn?: string,
    kind?: string,
    order?: number,
    alertCount?: AlertCount,
    errorCount?: number,
    children?: DiagramDataItem[]
}

export interface AboutItem {
    category: string,
    name: string,
    value: string
}

export type Marker = {
    kind: string,
    items: Record<string, any>[]
}

export type Montserrat = {
    defaultWidth: number;
    height: number;
    startCode: number;
    widths: number[];
}

export interface Field {
    selected_dn: string,
    time_machine_enabled: boolean,
    time_machine_target_date: Date,
    time_machine_date_to: Date,
    time_machine_duration: number
}

export type Params = {
    sd?: string | null,
    tme?: string | null,
    tmtd?: string | null,
    tmdt?: string | null,
    tmd?: string | null
}

export interface Messages {
    id?: string,
    msg: string,
    dn?: string,
    uiKey?: string,
    source: {
        id: string,
        kind: string,
    },
    severity: string,
}

export type Dn = {
    dn?: string,
    alertCount?: AlertCount,
}

export interface TopIssueNamespaces {
    kind: string,
    id: string,
    title: string,
    order: number,
    config: Dn[]
}
