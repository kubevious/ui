import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/Root'
import './index.scss';
import 'bootstrap/dist/css/bootstrap.min.css'
import MockRootApiService from './services-mock/MockRootApiService'
import RootApiService from './services/RootApiService'
import StateHandler from './state/state-handler'
import SharedState from './state/shared-state'
import DiagramSource from './state/diagram-source'

const sharedState = new SharedState()

const rootService = process.env.REACT_APP_MOCKED_DATA ? new MockRootApiService(sharedState) : new RootApiService(sharedState);
const service = rootService.kubevious();

const stateHandler = new StateHandler(sharedState, rootService);

const diagramSource = new DiagramSource(service);

ReactDOM.render(
    <Root service={service} sharedState={sharedState} diagramSource={diagramSource}/>,
    document.getElementById('root')
);
