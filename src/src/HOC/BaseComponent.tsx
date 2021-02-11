import { PureComponent } from 'react'
import { api, sharedState } from '../configureService'
import MockRootApiService from '../services-mock/MockRootApiService';
import RootApiService from '../services/RootApiService';
import { Service, SharedUserState } from '../types';
import { Info, Subscriber } from './types';

class BaseComponent extends PureComponent {
    _service: Service | null;
    _sharedState: SharedUserState
    _subscribers: Subscriber[];
    constructor(props) {
        super(props);

        this._service = null;
        this._sharedState = sharedState.user();
        this._subscribers = []

        console.log('[BaseComponent] ' + this.constructor.name + ' constructor. Props:', this.props);
    }

    get rootApi():  MockRootApiService | RootApiService {
        return api;
    }

    get service(): Service | null {
        return this._service
    }

    get sharedState(): SharedUserState {
        return this._sharedState
    }

    registerService(info: Info): void {
        this._service = api.resolveService(info);
    }

    subscribeToSharedState(subscribers: string, cb: any): void {
        var subscriber = this._sharedState.subscribe(subscribers, cb);
        this._subscribers.push(subscriber);
    }

    unsubscribeFromSharedState(): void {
        for(var x of this._subscribers) {
            x.close();
        }
        this._subscribers = [];
    }

    componentWillUnmount(): void {
        this.unsubscribeFromSharedState()
    }
}

export default BaseComponent
