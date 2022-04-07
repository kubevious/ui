import React, { FC, useState } from "react"
import { Feedback } from "../Feedback"
import { MessageNotification } from "../MessageNotification"
import { NewVersion } from "../NewVersion"

import {
    WorldviousVersionInfoResult,
    WorldviousNotificationKind,
    WorldviousFeedbackRequest,
    WorldviousMessageData,
    WorldviousNewVersionInfo,
    WorldviousNotificationItem
} from "@kubevious/ui-middleware/dist/services/worldvious"

import styles from './styles.module.css';

export interface NotificationListProps
{
    versionInfo: WorldviousVersionInfoResult;
}

export const NotificationList : FC<NotificationListProps> = ({ versionInfo }) => {

    const [notifications, setNotifications] = useState<WorldviousNotificationItem[]>(versionInfo.notifications);

    const onClearItem = (item: WorldviousNotificationItem) => {
        const newList = notifications.filter(x => x !== item);
        setNotifications(newList);
    }

    return (
        <div className={styles.notifications}>
            
            {(notifications.length === 0) && 
                <>
                    You have no more updates and notifications.
                </>
            }

            {notifications.map((item, index) => (
                <div key={index}>
                    {item.kind === WorldviousNotificationKind.newVersion && (
                        <NewVersion item={item as WorldviousNewVersionInfo} />
                    )}
                    {item.kind === WorldviousNotificationKind.feedbackRequest && (
                        <Feedback item={item as WorldviousFeedbackRequest}
                                  onClear={() => onClearItem(item)}/>
                    )}
                    {item.kind === WorldviousNotificationKind.message && (
                        <MessageNotification item={item as WorldviousMessageData}
                                             onClear={() => onClearItem(item)} />
                    )}
                </div>
            ))}
        </div>
    )
}
