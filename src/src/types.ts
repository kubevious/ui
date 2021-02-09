export type Service = new (...args: any) => Service;

export type AlertCount = {
    error?: number,
    warn?: number,
};

export type Flag = {
    propagatable?: boolean,
    name: string,
};

export type Flags = {
    shared: Flag,
    xnamespace: Flag,
    radioactive: Flag,
};

export interface DiagramData {
    flags?: Flags,
    dn?: string,
    rn?: string,
    kind?: string,
    order?: number,
    alertCount?: AlertCount,
    errorCount?: number,
    children: DiagramData[],
    markers?: string[],
    childrenCount: number,
    name?: string,
};

export type Montserrat = {
    defaultWidth: number,
    height: number,
    startCode: number,
    widths: number[],
};

export interface Field {
    selected_dn: string,
    time_machine_enabled: boolean,
    time_machine_target_date: Date,
    time_machine_date_to: Date,
    time_machine_duration: number,
};

export type Params = {
    sd?: string | null,
    tme?: string | null,
    tmtd?: string | null,
    tmdt?: string | null,
    tmd?: string | null,
};

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
};

export type Dn = {
    dn?: string,
    alertCount?: AlertCount,
};

export interface TopIssueNamespaces {
    kind: string,
    id: string,
    title: string,
    order: number,
    config: Dn[],
};
