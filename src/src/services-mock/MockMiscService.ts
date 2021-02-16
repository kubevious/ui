import {
    ABOUT_DATA,
    NEW_VERSION_AVAILABLE_DATA,
    FEEDBACK_QUESTIONS,
    MESSAGE_DATA,
} from "../boot/aboutMockData"

import { ISharedState } from "@kubevious/ui-framework"
import { MockRootApiService } from "./MockRootApiService"

import { IMiscService } from "@kubevious/ui-middleware"
import { Question } from "../components/Feedback/types"
import { RequestList } from "../components/Notifications/types"

type Notification = {
    kind: string
    id?: string
    name?: string
    questions?: Question[]
    title?: string
    content?: string
    version?: string
    url?: string
    changes?: string[]
    features?: string[]
    request?: RequestList
}

export class MockMiscService implements IMiscService {
    private parent: MockRootApiService
    private sharedState: ISharedState

    private _allNotifications = [
        NEW_VERSION_AVAILABLE_DATA,
        FEEDBACK_QUESTIONS,
        MESSAGE_DATA,
    ]
    private _snoozeDict: Record<string, boolean> = {}

    private _isNewVersionPresent: boolean = true
    private _currentNotifications: any[] = []
    private _notifications: any[] = []

    constructor(parent: MockRootApiService, sharedState: ISharedState) {
        this.parent = parent
        this.sharedState = sharedState

        this._updateNotifications()
        setInterval(() => {
            this._applyNotificationScenario()
        }, 60 * 1000)
    }

    close() {}

    private _applyNotificationScenario() {
        this._isNewVersionPresent = !this._isNewVersionPresent
        this._updateNotifications()
    }

    private _updateNotifications() {
        this._notifications = this._allNotifications.filter(
            (x: RequestList) => {
                if (x.kind == "new-version") {
                    if (this._isNewVersionPresent) {
                        return true
                    } else {
                        return false
                    }
                }

                const key = `${x.kind}-${x.id}`
                if (this._snoozeDict[key]) {
                    return false
                }
                return true
            }
        )

        this.sharedState.set("notifications_info", {
            count: this._notifications.length,
        })
        this.sharedState.set("notifications", {
            notifications: this._notifications,
        })
    }

    fetchAbout(cb: (data: any) => any): void {
        cb(ABOUT_DATA)
    }

    fetchNotifications(cb: (data: any) => any): void {
        cb(this._notifications)
    }

    submitFeedback(data: any, cb: (data: any) => any): void {
        console.log("[MockMiscService] Feedback: ", data)
        this._snoozeDict[`${data.kind}-${data.id}`] = true
        cb({})
    }

    submitSnooze(data: any, cb: (data: any) => any): void {
        console.log("[MockMiscService] Snooze: ", data)
        this._snoozeDict[`${data.kind}-${data.id}`] = true
        this._updateNotifications()
        cb({})
    }
}
