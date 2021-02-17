import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"

import "./styles.scss"
import { IMiscService } from "@kubevious/ui-middleware/dist"
import { NotificationList } from "../NotificationList"
import { RequestList } from "./types"

type NotificationsState = {
    list: RequestList[]
}

export class Notifications extends ClassComponent<{}, {}, IMiscService> {
    constructor(props) {
        super(props, { kind: "misc" })

        this.state = {
            list: [],
        }
    }

    componentDidMount() {
        this.subscribeToSharedState("notifications", (notifications) => {
            if (!notifications || notifications.notifications.length == 0) {
                const currentPopupWindow = this.sharedState.get("popup_window")
                if (
                    currentPopupWindow &&
                    currentPopupWindow.title === "Notifications"
                ) {
                    this.sharedState.set("popup_window", null)
                }
            } else {
                this.setState({ list: notifications.notifications })
            }
        })
    }

    render() {
        const { list } = this.state as NotificationsState
        return <NotificationList list={list} />
    }
}
