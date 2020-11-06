import React from 'react'
import Snooze from '../Snooze'

const MessageNotification = ({ request }) => {
    return (
        <div className="separate-container message">
            <h3>{request.title}</h3>
            <p>{request.content}</p>
            <Snooze id={request.id} kind={request.kind}  />
        </div>
    )
}

export default MessageNotification
