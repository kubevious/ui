import { PureComponent } from 'react'
import { api, sharedState } from '../configureService'

class BaseComponent extends PureComponent {
    constructor(props) {
        super(props);

        this._service = null;
        this._sharedState = sharedState
        this._subscribers = []

        console.log('[BaseComponent] ' + this.constructor.name + ' constructor. Props:', this.props);
    }

    get service() {
        return this._service
    }

    get sharedState() {
        return this._sharedState
    }

    registerService(info) {
        this._service = api.resolveService(info);
    }

    subscribeToSharedState(subscribers, cb) {
        this._subscribers = this._subscribers.concat(this._sharedState.subscribe(subscribers, cb).subscriber)
    }

    unsubscribeFromSharedState() {
        this._sharedState.unsubscribe(this._subscribers)
    }

    componentWillUnmount() {
        this.unsubscribeFromSharedState()
    }
}

export default BaseComponent
