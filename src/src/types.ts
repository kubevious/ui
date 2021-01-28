export type Service = new (...args: any) => Service;

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
