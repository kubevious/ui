import React, { FC } from "react"
import { WorldviousMarkdown } from "../WorldviousMarkdown"
import { Snooze } from "../Snooze"
import { WorldviousMessageData } from "@kubevious/ui-middleware/dist/services/worldvious"

import { WorldviousBlock } from '../WorldviousBlock'


export interface MessageNotificationProps
{
    item : WorldviousMessageData;
}

export const MessageNotification : FC<MessageNotificationProps> = ({ item }) => {
    return (
        <WorldviousBlock title={item.title}>

            <WorldviousMarkdown content={item.content} />

            <Snooze id={item.id} kind={item.kind} />
        </WorldviousBlock>
    )
}
