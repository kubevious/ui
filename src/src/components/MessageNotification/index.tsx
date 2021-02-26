import React from "react"
import Markdown from "markdown-to-jsx"
import "./styles.scss"
import { Snooze } from "../Snooze"
import { Request } from "./types"

export const MessageNotification = ({ request }: { request: Request}): JSX.Element => {
    return (
        <div className="separate-container message-block">
            <h3>{request.title}</h3>
            {request.content && <Markdown>{request.content}</Markdown>}
            <Snooze id={request.id} kind={request.kind} />
        </div>
    )
}
