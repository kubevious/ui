import {
    ABOUT_DATA,
    NEW_VERSION_AVAILABLE_DATA,
    NO_NEW_VERSION_AVAILABLE_DATA
} from '../boot/aboutMockData'

class MockMiscService {
    constructor(parent, sharedState) {
        this._parent = parent

        sharedState.set('new_version_info', NEW_VERSION_AVAILABLE_DATA);

        setInterval(() => {
            sharedState.set('new_version_info', NEW_VERSION_AVAILABLE_DATA);
        }, 5 * 1000);

        setInterval(() => {
            sharedState.set('new_version_info', NO_NEW_VERSION_AVAILABLE_DATA);
        }, 17 * 1000);
    }

    fetchAbout(cb) {
        cb(ABOUT_DATA);
    }

}

export default MockMiscService
