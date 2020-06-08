import { PureComponent } from 'react'
import SharedState from '../state/shared-state'
import StateHandler from '../state/state-handler'
import DiagramSource from '../state/diagram-source'
import { api } from '../configureService'

const sharedState = new SharedState()

const rootService = api.diagram(sharedState)
const service = rootService.kubevious()

new StateHandler(sharedState, rootService);

const diagramSource = new DiagramSource(sharedState, service);

class BaseComponent extends PureComponent {
    constructor(props) {
        super(props);

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

    registerService({ kind }) {
        switch (kind) {
            case 'kubevious':
                this._service = service
                break
            case 'marker':
                this._service = service._markerService
                break
            case 'rule':
                this._service = service._ruleService
                break
            default:
                this._service = service
                break
        }
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
