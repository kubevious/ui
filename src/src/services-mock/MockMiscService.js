import {
    ABOUT_DATA
} from '../boot/diagramMockData'

class MockMiscService {
    constructor(parent) {
        this._parent = parent
    }

    fetchAbout(cb) {
        cb(ABOUT_DATA);
    }

}

export default MockMiscService
