import React from "react"

import { ClassComponent } from "@kubevious/ui-framework"
import { IRuleService } from "@kubevious/ui-middleware"
import { AlertView } from "../../Alerts/AlertView"
import { Config, PropertiesAlertListProps } from "./types"
import { Alert } from "../../../types"

export class PropertiesAlertList extends ClassComponent<PropertiesAlertListProps> {
    clickDn = (dn: string): void => {
        this.sharedState.set("selected_dn", dn)
        this.sharedState.set("auto_pan_to_selected_dn", true)
    }

    openRule = (ruleName: string): void => {
        this.sharedState.set("rule_editor_selected_rule_id", ruleName)
        this.sharedState.set("focus_rule_editor", true)
    }

    configureAlerts(): Alert[] {
        const { config } = this.props
        let alerts: Alert[] = []

        config.map((elem: Config) => {
            alerts = [
                ...alerts,
                ...elem.targets.map((dn: string) => ({
                    dn,
                    id: elem.alert.source.id || "Missing",
                    msg: elem.alert.msg,
                    severity: elem.alert.severity,
                    source: elem.alert.source,
                    uiKey: `${dn}-${elem.alert.severity}-${elem.alert.source.id}-${elem.alert.msg}`,
                })),
            ]
        })

        return alerts
    }

    render() {
        const parsedAlerts = this.configureAlerts()

        return (
            <AlertView
                alerts={parsedAlerts}
                clickDn={this.clickDn}
                openRule={this.openRule}
                groupPreset="message"
            />
        )
    }
}
