import { v4 as uuidv4 } from 'uuid';
import { isEmptyObject } from './util';

class RemoteTrack {
    constructor(sharedState) {
        this._sharedState = sharedState
        this._requests = {}
    }

    start({ action, options }) {
        this._sharedState.set('is_loading', true)

        const request = {
            id: uuidv4(),
            options,
            complete: false,
        }

        this._requests[request.id] = request

        console.log(`[REMOTE_TRACK] => ${action}`)

        return {
            request: request.id,

            complete: () => {
                this.detectLoading(request.id)
            },

            fail: (error) => {
                this._sharedState.set('is_error', true)
                this._sharedState.set('error', error)

                this.detectLoading(request.id)
            },
        }
    }

    detectLoading(id) {
        delete this._requests[id];

        if (isEmptyObject(this._requests)) {
            this._sharedState.set('is_loading', false)
        }
    }
}

export default RemoteTrack
