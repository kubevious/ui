import React from "react"
import "./styles.scss"
import { ClassComponent } from "@kubevious/ui-framework"
import { FieldsSaver } from "../../utils/save-fields"
import { ErrorBox } from "../ErrorBox"
import { GoldenLayoutComponent } from "../GoldenLayout"
import { Header } from "../Header"
import { Popup } from "../Popup"
import { SEO } from "../SEO"
import { PersistableFields } from "../../types"
import { Component } from "../GoldenLayout/types"
import { Error } from "../ErrorBox/types"
import { DiagramSource } from "../../state/diagram-source"

type RootState = {
    showPopup: boolean
    popupContent: any
    layout: GoldenLayoutComponent | null
    windows: Component[]
    isError: boolean
    error: Error | null
}

export class Root extends ClassComponent<{}, RootState> {
    private _fieldsSaver: FieldsSaver
    diagramSource!: DiagramSource
    constructor(props) {
        super(props)

        this.state = {
            showPopup: false,
            popupContent: null,
            layout: null,
            windows: [],
            isError: false,
            error: null,
        }

        this._fieldsSaver = new FieldsSaver("Diagram")

        this.handleLayout = this.handleLayout.bind(this)
        this.handleChangeWindow = this.handleChangeWindow.bind(this)
        this.closeError = this.closeError.bind(this)

        let fieldsValues: PersistableFields = {}

        this.subscribeToSharedState(
            [
                "selected_dn",
                "time_machine_enabled",
                "time_machine_target_date",
                "time_machine_date_to",
                "time_machine_duration",
            ],
            ({
                selected_dn,
                time_machine_enabled,
                time_machine_target_date,
                time_machine_date_to,
                time_machine_duration,
            }) => {
                this._fieldsSaver.setValue({
                    selected_dn,
                    time_machine_enabled,
                    time_machine_target_date,
                    time_machine_date_to,
                    time_machine_duration,
                })
            }
        )
    }

    handleLayout(value: GoldenLayoutComponent): void {
        this.setState({
            layout: value,
            windows: value.components
                .filter((item) => !item.skipClose)
                .map((component) => ({ ...component, isVisible: true })),
        })

        this.subscribeToSharedState(
            ["selected_dn", "auto_pan_to_selected_dn"],
            ({ selected_dn, auto_pan_to_selected_dn }) => {
                if (selected_dn) {
                    value.activateComponent("universeComponent")
                }
            }
        )

        this.subscribeToSharedState(
            ["rule_editor_selected_rule_id", "focus_rule_editor"],
            ({ rule_editor_selected_rule_id, focus_rule_editor }) => {
                if (rule_editor_selected_rule_id && focus_rule_editor) {
                    value.activateComponent("ruleEditorComponent")
                    this.sharedState.set("focus_rule_editor", false)
                }
            }
        )
    }

    closeError(): void {
        this.sharedState.set("is_error", false)
        this.sharedState.set("error", null)
    }

    handleChangeWindow(e: React.ChangeEvent<HTMLInputElement>) {
        const { windows, layout } = this.state

        const windowId = e.target.getAttribute("tool-window-id") || ""
        const isVisible = document.getElementById(windowId) !== null

        this.setState({
            windows: windows.map((component) =>
                component.id === windowId
                    ? {
                          ...component,
                          isVisible: isVisible,
                      }
                    : component
            ),
        })

        if (isVisible) {
            layout && layout.hideComponent(windowId)
        } else {
            layout && layout.showComponent(windowId)
        }
    }

    componentDidMount() {
        this.subscribeToSharedState(
            ["is_error", "error"],
            ({ is_error, error }) => {
                this.setState({ error: error, isError: is_error })
            }
        )

        this.subscribeToSharedState("popup_window", (popup_window) => {
            if (popup_window) {
                this.setState({
                    showPopup: true,
                    popupContent: popup_window.content,
                })
            } else {
                this.setState({
                    showPopup: false,
                    popupContent: null,
                })
            }
        })
    }

    render() {
        const { showPopup, popupContent, windows, isError, error } = this
            .state

        return (
            <>
                <SEO />
                <div className="mobile-wrapper">
                    <div className="logo" />
                    <div className="available-msg">
                        Sorry!
                        <br />
                        <br />
                        Kubevious works with Desktop browsers only.
                        <br />
                        <br />
                        <a
                            href="https://kubevious.io/youtube.html"
                            className="link-cta"
                        >
                            See Demo in Youtube
                        </a>
                    </div>
                </div>
                <div className="wrapper">
                    <Header
                        handleChangeWindow={this.handleChangeWindow}
                        windows={windows}
                    />

                    <GoldenLayoutComponent
                        diagramSource={this.diagramSource}
                        handleLayout={this.handleLayout}
                    />

                    {showPopup && <Popup popupContent={popupContent} />}

                    {isError && error && (
                        <ErrorBox error={error} closeError={this.closeError} />
                    )}
                </div>
            </>
        )
    }
}
