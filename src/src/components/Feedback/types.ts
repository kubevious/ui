export type UserAnswers = {
    [id: string]: Answer
}

export type Answer = {
    id: string
    value?: string
    hasValue: boolean
    options?: {
        [id: string]: boolean
    }
}

export type MissingAnswers = {
    [id: string]: boolean
}

export type Question = {
    id: string
    kind: string
    text: string
    options: string[]
    optional: boolean
}

export enum Kind {
    input = "input",
    rate = "rate",
    single_select = "single-select",
    multi_select = "multi-select",
}
