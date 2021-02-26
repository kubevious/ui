import React from "react"
import { ClassComponent, IService } from "@kubevious/ui-framework"
import { AlertView } from "./AlertView"
import { isEmptyArray, sortSeverity } from "../../utils/util"
import cx from "classnames"

import "./styles.scss"

import { sharedState } from "../../configureService"
import { Alert } from "../../types"
import { AlertsState } from "./types"

export class Alerts extends ClassComponent<{}, AlertsState> {
    constructor(props) {
        super(props)

        this.state = {
            alerts: [],
            isDnSelected: false,
        }

        this.clickDn = this.clickDn.bind(this)
        this.openRule = this.openRule.bind(this)
    }

    componentDidMount(): void {
        this.subscribeToSharedState(
            "selected_object_alerts",
            (selected_object_alerts: Alert[]) => {
                this.setState({ alerts: selected_object_alerts })
            }
        )
        this.subscribeToSharedState("selected_dn", (selected_dn: string) => {
            if (selected_dn) {
                this.setState({ isDnSelected: true })
            }
        })
    }

    clickDn(dn: string): void {
        sharedState.set("selected_dn", dn)
        sharedState.set("auto_pan_to_selected_dn", true)
    }

    openRule(ruleName: string): void {
        sharedState.set("rule_editor_selected_rule_id", ruleName)
        sharedState.set("focus_rule_editor", true)
    }

    renderAlerts(alerts: Alert[]): JSX.Element {
        if (isEmptyArray(alerts)) {
            return sharedState.get("selected_dn") ? (
                <div className="message-empty">
                    No alerts for selected object.
                </div>
            ) : (
                <div className="message-empty">No object selected.</div>
            )
        }

        return (
            <AlertView
                alerts={alerts.sort(sortSeverity)}
                clickDn={this.clickDn}
                openRule={this.openRule}
            />
        )
    }

    render() {
        const { alerts } = this.state
        return (
            <div
                id="alertsComponent"
                className={cx({ empty: isEmptyArray(alerts) })}
            >
                {this.renderAlerts(alerts)}
            </div>
        )
    }
}
