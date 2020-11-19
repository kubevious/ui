import React from 'react'
import Feedback from '../Feedback'
import MessageNotification from '../MessageNotification'
import NewVersion from '../NewVersion'

import './styles.scss'

const NotificationList = ({ list }) => {
    return (
      <div className="p-40">
        <div>
          <h3 className="heading-text">Notifications</h3>
        </div>
        <div className="notification-container overflow-hide">
          {(!list) && <>
            You have no more notifications.
          </>}
          {list.map((item, index) => (
            <div key={index}>
              {(item.kind == 'new-version') && <NewVersion info={item} />}
              {(item.kind == 'feedback-request') && <Feedback request={item} />}
              {(item.kind == 'message') && <MessageNotification request={item} />}
            </div>
          ))}
        </div>
      </div>
    )
}

export default NotificationList
