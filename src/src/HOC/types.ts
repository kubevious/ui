export type Info = {
    kind: string
}

export type Subscriber = {
    id: string
    close: () => void
}
