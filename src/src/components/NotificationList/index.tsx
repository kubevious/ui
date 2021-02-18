import React from "react"
import { Feedback } from "../Feedback"
import { MessageNotification } from "../MessageNotification"
import { NewVersion } from "../NewVersion"
import { RequestList } from "../Notifications/types"

import "./styles.scss"
import { Kind } from "./types"

export const NotificationList = ({ list }: { list: RequestList[] }) => {
    return (
        <div className="p-40">
            <div>
                <h3 className="heading-text">Notifications</h3>
            </div>
            <div className="notification-container overflow-hide">
                {!list && <>You have no more notifications.</>}
                {list.map((item, index) => (
                    <div key={index}>
                        {item.kind === Kind.new_version && (
                            <NewVersion info={item} />
                        )}
                        {item.kind === Kind.feedback_request && (
                            <Feedback request={item} />
                        )}
                        {item.kind === Kind.message && (
                            <MessageNotification request={item} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}