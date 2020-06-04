import React, { PureComponent } from 'react'
import SharedState from '../../state/shared-state'
import MockRootApiService from '../../services-mock/MockRootApiService'
import RootApiService from '../../services/RootApiService'
import StateHandler from '../../state/state-handler'
import DiagramSource from '../../state/diagram-source'

const sharedState = new SharedState()

const rootService = process.env.REACT_APP_MOCKED_DATA ? new MockRootApiService(sharedState) : new RootApiService(sharedState);
const service = rootService.kubevious();

const stateHandler = new StateHandler(sharedState, rootService);

const diagramSource = new DiagramSource(sharedState, service);

class BaseComponent extends PureComponent {
    constructor(props) {
        super(props);

        this._service = service
        this._sharedState = sharedState
        this._diagramSource = diagramSource
        this._subscribers = []
    }

    get service() {
        return this._service
    }

    get sharedState() {
        return this._sharedState
    }

    get diagramSource() {
        return this._diagramSource
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
