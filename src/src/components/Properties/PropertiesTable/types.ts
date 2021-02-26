export type Header = {
    id: string
    label?: string
    kind?: string
}

export type Row = {
    api: string
    resource: string
    name: string
    namespace: string
    get?: boolean
    list?: boolean
    update?: boolean
    watch?: boolean
    patch?: boolean
    create?: boolean
}

export type Column = {
    name?: string
    label?: string
    formatter?: string
}

export type Config = {
    headers: Header[]
    rows: Row[]
}
