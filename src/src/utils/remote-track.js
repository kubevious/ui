class RemoteTrack {
    constructor(sharedState) {
        this._sharedState = sharedState
    }

    start({ action }) {
        this._sharedState.set('is_loading', true)
        console.log(`[REMOTE_TRACK] => ${action}`)
    }

    complete() {
        this._sharedState.set('is_loading', false)
    }

    fail(error) {
        this._sharedState.set('is_error', true)
        this._sharedState.set('error', error)

        setTimeout(() => {
            this._sharedState.set('is_error', false)
            this._sharedState.set('error', null)
        }, 4000)

        this._sharedState.set('is_loading', false)
    }
}

export default RemoteTrack
