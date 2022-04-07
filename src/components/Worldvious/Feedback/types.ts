export type UserAnswers = {
    [id: string]: UserAnswer
}

export type UserAnswer = {
    id: string
    value?: string[]
    hasValue: boolean
}

export type MissingAnswers = {
    [id: string]: boolean
}

export type FeedbackState = {
    userAnswers: UserAnswers
    missingAnswers: MissingAnswers
    isSubmitAllowed: boolean
}

export type FeedbackProps = {
    request: {
        kind: string
        id?: string
        questions?: Question[]
    }
}

export type Question = {
    id: string
    kind: string
    text: string
    options?: string[]
    optional?: boolean
}

export enum Kind {
    input = "input",
    rate = "rate",
    single_select = "single-select",
    multi_select = "multi-select",
}
