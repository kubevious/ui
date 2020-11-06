import React from 'react'
import Snooze from '../Snooze'

const MessageNotification = ({ request }) => {
    return (
        <div className="separate-container message">
            <Snooze id={request.id} />
            <h3>{request.title}</h3>
            <p>{request.content}</p>
        </div>
    )
}

export default MessageNotification
