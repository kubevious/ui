import { AxiosRequestConfig } from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { isEmptyObject } from './util';

class RemoteTrack {
    private _sharedState: any
    _requests: {};
    constructor(sharedState: {}) {
        this._sharedState = sharedState
        this._requests = {}
    }

    start({
        action,
        options
    }: {
        action: string
        options: AxiosRequestConfig,
    }):{
        request: string;
        complete: () => void;
        fail: (error: any) => void;
    } {
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

    detectLoading(id: string): void {
        delete this._requests[id];

        if (isEmptyObject(this._requests)) {
            this._sharedState.set('is_loading', false)
        }
    }
}

export default RemoteTrack
