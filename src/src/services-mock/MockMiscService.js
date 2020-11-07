import {
    ABOUT_DATA,
    NEW_VERSION_AVAILABLE_DATA,
    FEEDBACK_QUESTIONS,
    MESSAGE_DATA
} from '../boot/aboutMockData'

class MockMiscService {
    constructor(parent, sharedState) {
        this._sharedState = sharedState;
        this._parent = parent

        this._allNotifications = [
            NEW_VERSION_AVAILABLE_DATA,
            FEEDBACK_QUESTIONS,
            MESSAGE_DATA
        ]
        this._snoozeDict = {};

        this._isNewVersionPresent = true;
        this._currentNotifications = [];

        this._updateNotifications();
        setInterval(() => {
            this._applyNotificationScenario();
        }, 5 * 1000);
    }

    _applyNotificationScenario()
    {
        this._isNewVersionPresent = !this._isNewVersionPresent;
        this._updateNotifications();
    }

    _updateNotifications()
    {
        this._notifications = this._allNotifications.filter(x => {
            if (x.kind == 'new-version') {
                if (this._isNewVersionPresent) {
                    return true;
                } else {
                    return false;
                }
            }

            const key = `${x.kind}-${x.id}`;
            if (this._snoozeDict[key]) {
                return false;
            }
            return true;
        });

        this._sharedState.set('notifications_info', {
            count: this._notifications.length
        });
        this._sharedState.set('notifications', {
            notifications: this._notifications
        });
    }

    fetchAbout(cb) {
        cb(ABOUT_DATA);
    }

    fetchNotifications(cb) {
        cb(this._notifications);
    }

    submitFeedback(data, cb) {
        this._snoozeDict[`${data.kind}-${data.id}`] = true;
        cb()
    }

    submitSnooze(data, cb) {
        this._snoozeDict[`${data.kind}-${data.id}`] = true;
        this._updateNotifications();
        cb()
    }
}

export default MockMiscService
