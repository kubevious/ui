import { Question } from "../Feedback/types"

export type RequestList = {
    kind: string
    id?: string
    name?: string
    questions?: Question[]
    title?: string
    content?: string
    version?: string
    url?: string
    changes?: string[]
    features?: string[]
    request?: RequestList
}

export type NotificationsState = {
    list: RequestList[]
}
