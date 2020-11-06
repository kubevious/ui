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

        this._notificationScenario = 0;
        this._applyNotificationScenario();

        setInterval(() => {
            this._applyNotificationScenario();
        }, 5 * 1000);
    }

    _applyNotificationScenario()
    {
        if (this._notificationScenario == 0) {
            this._updateNotifications([ NEW_VERSION_AVAILABLE_DATA, FEEDBACK_QUESTIONS, MESSAGE_DATA ]);
        } else if (this._notificationScenario == 1) {
            this._updateNotifications([ ]);
        } else if (this._notificationScenario == 2) {
            this._updateNotifications([ NEW_VERSION_AVAILABLE_DATA ]);
        } else if (this._notificationScenario == 3) {
            this._updateNotifications([ FEEDBACK_QUESTIONS ]);
        } else if (this._notificationScenario == 4) {
            this._updateNotifications([ MESSAGE_DATA ]);
        }
        this._notificationScenario = (this._notificationScenario + 1) % 5;
    }

    _updateNotifications(values)
    {
        this._notifications = values;
        this._sharedState.set('notifications_info', {
            count: this._notifications.length
        });
    }

    fetchAbout(cb) {
        cb(ABOUT_DATA);
    }

    fetchNotifications(cb) {
        cb(this._notifications);
    }

    submitFeedback(data, cb) {
        cb(data)
    }

    submitSnooze(data, cb) {
        cb(data)
    }
}

export default MockMiscService
