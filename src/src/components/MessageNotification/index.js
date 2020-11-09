import React from 'react'
import Snooze from '../Snooze'
import Markdown from 'markdown-to-jsx'
import './styles.scss'

const MessageNotification = ({ request }) => {
    return (
        <div className="separate-container message-block">
            <h3>{request.title}</h3>
            <Markdown>{request.content}</Markdown>
            <Snooze id={request.id} kind={request.kind}  />
        </div>
    )
}

export default MessageNotification
