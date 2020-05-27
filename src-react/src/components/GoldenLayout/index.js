import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import _ from 'lodash'
import 'golden-layout/src/css/goldenlayout-base.css'
import 'golden-layout/src/css/goldenlayout-dark-theme.css'
import GoldenLayout from 'golden-layout'
import Diagram from '../Diagram'
import Properties from '../Properties'
import Alerts from '../Alerts'
import Timeline from '../Timeline'
import RuleEditor from '../RuleEditor'
import Logs from '../Logs'
import UiLogs from '../UiLogs'
import Events from '../Events'

import './styles.scss'

class GoldenLayoutComponent extends PureComponent {
    constructor(props) {
        super(props)
        this._components = []
    }

    componentDidMount() {
        setTimeout(() => {
            this._register({
                name: 'Universe',
                component: Diagram,
                location: 'main',
                title: 'Universe',
                skipClose: true
            })
            this._register({
                name: 'Rule Editor',
                component: RuleEditor,
                location: 'main',
                title: 'Rule Editor',
            })
            this._register({
                name: 'Properties',
                component: Properties,
                location: 'right',
                title: 'Properties',
                width: 25,
                allowVerticalScroll: true
            })
            this._register({
                name: 'Alerts',
                component: Alerts,
                location: 'bottom',
                title: 'Alerts',
                allowVerticalScroll: true
            })
            this._register({
                name: 'Events',
                component: Events,
                location: 'bottom',
                title: 'Events',
                allowVerticalScroll: true
            })
            this._register({
                name: 'Logs',
                component: Logs,
                location: 'bottom',
                title: 'Logs',
                allowVerticalScroll: true
            })
            this._register({
                name: 'UI Logs',
                component: UiLogs,
                location: 'bottom',
                title: 'UI Logs',
                allowVerticalScroll: true
            })
            this._register({
                name: 'Timeline',
                component: Timeline,
                location: 'bottom',
                title: 'Timeline',
                allowVerticalScroll: true
            })

            this._activateLayout()

        }, 0)
    }

    _activateLayout() {
        var self = this;

        this._layoutConfig = {
            content: [{
                type: 'column',
                content: [
                    {
                        type: 'row',
                        content: [
                            {
                                type: 'column',
                                content: [
                                    this._getLocationLayout('main'),
                                    this._getLocationLayout('bottom')
                                ]
                            },
                            this._getLocationLayout('right')
                        ]
                    }
                ]
            }]
        }

        this._layout = new GoldenLayout(this._layoutConfig, '#layoutContainer')

        for (var component of this._components) {
            this._setupContent(component.id, component.component)
        }

        this._layout.on('componentCreated', function (component) {
            self._triggerComponentResizeEvent(component);

            component.container.on('resize', function () {
                self._triggerComponentResizeEvent(component);
            });
        });

        this._layout.init()

        window.addEventListener('resize', () => {
            this._layout.updateSize();
        });
    }


    _register(info) {
        var id = info.name
        id = _.camelCase(id)
        id = id + 'Component'
        info.id = id
        this._components.push(info)
    }

    _getLocationComponents(location) {
        return _.filter(this._components, x => x.location === location)
    }

    _getLocationLayout(location) {
        var components = this._getLocationComponents(location)
        if (components.length === 0) {
            return null
        }
        if (components.length === 1) {
            return this._getComponentLayout(components[0])
        }

        var layout = {
            type: 'stack'
        }

        if (location !== 'main') {
            layout.height = 20
        }
        layout.content = _.map(components, x => this._getComponentLayout(x))
        return layout
    }

    _getComponentLayout(component) {
        var layout = {}

        layout.type = 'react-component'
        layout.component = component.id
        layout.title = component.name
        layout.componentState = {}
        layout.props = _.clone(this.props);
        if (component.skipClose) {
            layout.isClosable = false
        }
        if (component.width) {
            layout.width = component.width
        }
        if (component.height) {
            layout.height = component.height
        }
        if (component.allowVerticalScroll) {
            layout.componentState.allowVerticalScroll = component.allowVerticalScroll
        }
        return layout
    }

    _setupContent(name, component) {
        this._layout.registerComponent(name, component)
    }

    render() {
        window.React = React
        window.ReactDOM = ReactDOM

        return (
            <>
                <div id="layoutContainer"/>
            </>
        )
    }

    _triggerComponentResizeEvent(component) {
        this._triggerEvent('layout-resize-' + component.config.component);
    }

    _triggerEvent(id) {
        console.log('EVENT: ' + id);
        $(document).trigger(id);
    }
}

export default GoldenLayoutComponent
