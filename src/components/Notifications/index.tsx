import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"

import "./styles.scss"
import { IMiscService } from "@kubevious/ui-middleware"
import { NotificationList } from "../NotificationList"
import { NotificationsState } from "./types"

export class Notifications extends ClassComponent<{}, NotificationsState, IMiscService> {
    constructor(props) {
        super(props, null, { kind: "misc" })

        this.state = {
            list: [],
        }
    }

    componentDidMount() {
        this.subscribeToSharedState("notifications", (notifications) => {
            if (!notifications || notifications.notifications.length == 0) {
                const currentPopupWindow = this.sharedState.tryGet("popup_window");
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
        const { list } = this.state
        return <NotificationList list={list} />
    }
}
