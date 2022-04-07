import React, { FC } from "react"
import { Feedback } from "../Feedback"
import { MessageNotification } from "../MessageNotification"
import { NewVersion } from "../NewVersion"

import {
    WorldviousVersionInfoResult,
    WorldviousNotificationKind,
    WorldviousFeedbackRequest,
    WorldviousMessageData,
    WorldviousNewVersionInfo
} from "@kubevious/ui-middleware/dist/services/worldvious"

import styles from './styles.module.css';

export interface NotificationListProps
{
    versionInfo: WorldviousVersionInfoResult;
}

export const NotificationList : FC<NotificationListProps> = ({ versionInfo }) => {
    return (
        <div className={styles.notifications}>
            {!versionInfo.notifications && <>You have no more notifications.</>}
            {versionInfo.notifications.map((item, index) => (
                <div key={index}>
                    {item.kind === WorldviousNotificationKind.newVersion && (
                        <NewVersion item={item as WorldviousNewVersionInfo} />
                    )}
                    {item.kind === WorldviousNotificationKind.feedbackRequest && (
                        <Feedback item={item as WorldviousFeedbackRequest} />
                    )}
                    {item.kind === WorldviousNotificationKind.message && (
                        <MessageNotification item={item as WorldviousMessageData} />
                    )}
                </div>
            ))}
        </div>
    )
}
