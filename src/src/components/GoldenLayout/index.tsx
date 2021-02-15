import React from "react"
import { BaseComponent, IService } from "@kubevious/ui-framework"
import ReactDOM from "react-dom"
import $ from "jquery"
import _ from "the-lodash"
import "golden-layout/src/css/goldenlayout-base.css"
import "golden-layout/src/css/goldenlayout-dark-theme.css"
import GoldenLayout from "golden-layout"
import { RegisterComponents } from "./register-components"

import "./styles.scss"
import { Component, Components } from "./types"

type Layout = {
    height?: number
    type: string
    content?: GoldenLayout.ContentItem
}

export class GoldenLayoutComponent extends BaseComponent<IService> {
    private _components: Component[]
    private _layoutConfig: GoldenLayout.Config
    private _layout: GoldenLayout | undefined
    constructor(props) {
        super(props)
        this._layoutConfig = {}
        this._components = []
    }

    componentDidMount() {
        new RegisterComponents(this)
        this._activateLayout()
    }

    _activateLayout() {
        var self = this

        this._layoutConfig = {
            content: [
                {
                    type: "column",
                    content: [
                        {
                            type: "row",
                            content: [
                                {
                                    type: "column",
                                    content: [
                                        this._getLocationLayout("main"),
                                        this._getLocationLayout("bottom"),
                                    ],
                                },
                                this._getLocationLayout("right"),
                            ],
                        },
                    ],
                },
            ],
        }
        const container = $("#layoutContainer")
        this._layout = new GoldenLayout(this._layoutConfig, container)

        for (var component of this._components) {
            component.id &&
                this._setupContent(component.id, component.component)
        }

        this._layout.on("componentCreated", (component) => {
            self._triggerComponentResizeEvent(component)

            let info = this._getComponent(component.config.component)
            info.goldenComponent = component
            info.goldenContainer = component.container

            component.container.on("resize", function () {
                self._triggerComponentResizeEvent(component)
            })
        })

        this._layout.on("tabCreated", (tab) => {
            var info = this._getComponent(tab.contentItem.config.component)
            info.goldenTab = tab

            tab.closeElement.off("click").click((e) => {
                const component = this._components.find(
                    (item) => item.name === e.target.parentNode.title
                )

                if (component && component.id) {
                    const id = component.id
                    this.hideComponent(id)
                }
            })
        })

        this._layout.init()

        this.props.handleLayout(this)

        window.addEventListener("resize", () => {
            this._layout && this._layout.updateSize()
        })
    }

    _register(info: Component): void {
        var id = info.name
        id = _.camelCase(id)
        id = id + "Component"
        info.id = id
        this._components.push(info)
    }

    activateComponent(id: string): void {
        var info = this._getComponent(id)
        if (!info.goldenTab) {
            return
        }

        var stack = info.goldenTab.contentItem.parent
        var stackComponent = _.head(
            stack.contentItems.filter((x) => x.config.component === id)
        )
        if (stackComponent) {
            stack.setActiveContentItem(stackComponent)
        }
    }

    _getComponent(id: string): Component {
        return _.filter(this._components, (x: Component) => x.id === id)[0]
    }

    hideComponent(id: string) {
        const info = this._getComponent(id)
        info.goldenContainer.close()
    }

    showComponent(id: string) {
        const info = this._getComponent(id)
        const componentLayout = this._getComponentLayout(info)
        this._layout &&
            this._layout.root.contentItems[0].addChild(componentLayout)
    }

    _getLocationComponents(location) {
        return _.filter(this._components, (x) => x.location === location)
    }

    _getLocationLayout(location: string): GoldenLayout.ItemConfigType {
        var components = this._getLocationComponents(location)
        if (components.length === 1) {
            return this._getComponentLayout(components[0])
        }

        var layout: GoldenLayout.ItemConfigType = {
            type: "stack",
        }

        if (location !== "main") {
            layout.height = 20
        }
        layout.content = _.map(components, (x: Component) =>
            this._getComponentLayout(x)
        )
        return layout
    }

    _getComponentLayout(component: Component): GoldenLayout.ItemConfigType {
        var layout: any = {}

        layout.type = "react-component"
        layout.component = component.id
        layout.title = component.name
        layout.componentState = {}
        layout.props = _.clone(this.props)
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
            layout.componentState.allowVerticalScroll =
                component.allowVerticalScroll
        }
        return layout
    }

    _setupContent(name: string, component: Components): void {
        this._layout && this._layout.registerComponent(name, component)
    }

    render() {
        window.React = React
        window.ReactDOM = ReactDOM

        return <div id="layoutContainer" />
    }

    // Component from 'golden-layout'
    _triggerComponentResizeEvent(component: any): void {
        this._triggerEvent("layout-resize-" + component.config.component)
    }

    _triggerEvent(id: string): void {
        console.log("EVENT: " + id)
        const a = $(document).trigger(id)
    }
}
