import {
    ABOUT_DATA,
    NEW_VERSION_AVAILABLE_DATA,
    FEEDBACK_QUESTIONS
} from '../boot/aboutMockData'

class MockMiscService {
    constructor(parent, sharedState) {
        this._sharedState = sharedState;
        this._parent = parent
        
        this._updateNotifications([ NEW_VERSION_AVAILABLE_DATA, FEEDBACK_QUESTIONS ]);

        setInterval(() => {
            this._updateNotifications([ NEW_VERSION_AVAILABLE_DATA ]);
        }, 5 * 1000);

        setInterval(() => {
            this._updateNotifications([ FEEDBACK_QUESTIONS ]);
        }, 9 * 1000);

        setInterval(() => {
            this._updateNotifications([]);
        }, 17 * 1000);
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

}

export default MockMiscService
