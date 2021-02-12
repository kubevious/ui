import React, { useState } from "react"
import cx from "classnames"
import {
    sortSeverity,
    uniqueMessages,
    uniqueObjects,
} from "../../../utils/util"
import DnPath from "../../GenerateDnPath"
import * as DnUtils from "@kubevious/helpers/dist/dn-utils"
import { Messages } from "../../../types"

const AlertView = ({
    alerts,
    clickDn,
    openRule,
    groupPreset,
}: {
    alerts: Messages[]
    clickDn: (dn: string) => void
    openRule: (ruleName: string) => void
    groupPreset?: string
}): JSX.Element => {
    const [group, setGroup] = useState<string>(groupPreset || "no")

    const clickMessage = (alert: Messages): void => {
        if (alert.source.kind === "rule") {
            openRule(alert.source.id)
        }
    }

    const renderAlert = ({
        alert,
        index,
        shouldRenderDn = true,
    }: {
        alert: Messages
        index?: number
        shouldRenderDn?: boolean
    }): JSX.Element => {
        return (
            <div
                className={cx("alert-detail", {
                    even: index && index % 2 !== 0,
                })}
                key={alert.uiKey}
            >
                <div
                    className={cx("message-container", {
                        rule: alert.source.kind === "rule",
                    })}
                    onClick={() => clickMessage(alert)}
                >
                    <div className={"alert-item " + alert.severity} />
                    {alert.msg}
                </div>

                {shouldRenderDn && alert.dn && renderDnParts(alert.dn)}
            </div>
        )
    }

    const renderDnParts = (dn: string): JSX.Element => {
        const dnParts = DnUtils.parseDn(dn).slice(1)

        return (
            <div className="dn-container" key={dn} onClick={() => clickDn(dn)}>
                <div className="logo-container">
                    <img
                        className="dn-logo"
                        src="/img/entities/ns.svg"
                        alt="logo"
                    />
                </div>
                <div className="parts-container">
                    <DnPath dnParts={dnParts} />
                </div>
            </div>
        )
    }

    const renderMessageGroup = (): JSX.Element => {
        const messages = uniqueMessages(
            alerts.map(({ msg, severity, source }) => ({
                msg,
                severity,
                source,
            }))
        )
            .map((m) => ({
                ...m,
                alerts: alerts.filter(
                    (a) => a.severity === m.severity && a.msg === m.msg
                ),
            }))
            .sort(sortSeverity)

        return (
            <>
                {messages.map((message, index) => (
                    <div className="message-group-container" key={index}>
                        <div
                            className={cx("message-container", {
                                rule: message.source.kind === "rule",
                            })}
                            onClick={() => clickMessage(message)}
                        >
                            <div className={"alert-item " + message.severity} />
                            {message.msg}
                        </div>

                        <div className="message-objects">
                            {message.alerts.map((alert) =>
                                alert.dn ? renderDnParts(alert.dn) : null
                            )}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    const renderObjectGroup = (): JSX.Element => {
        const objects = uniqueObjects(alerts.map(({ dn }) => ({ dn }))).map(
            (o) => ({
                ...o,
                alerts: alerts.filter((a) => a.dn === o.dn),
            })
        )

        return (
            <>
                {objects.map((object, index) => (
                    <div className="message-group-container" key={index}>
                        <div className="object-container">
                            {object.dn && renderDnParts(object.dn)}
                        </div>

                        <div className="message-objects">
                            {object.alerts.map((alert) =>
                                renderAlert({ alert, shouldRenderDn: false })
                            )}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className="AlertView-container">
            <div className={`alerts group-${group}`}>
                {group === "no" && (
                    <>
                        {alerts.map((alert, index) =>
                            renderAlert({ alert, index })
                        )}
                    </>
                )}

                {group === "message" && renderMessageGroup()}

                {group === "object" && renderObjectGroup()}
            </div>

            {!groupPreset && (
                <div className="group-options">
                    <div
                        className={cx("option", { selected: group === "no" })}
                        onClick={() => setGroup("no")}
                    >
                        No Group
                    </div>

                    <div
                        className={cx("option", {
                            selected: group === "object",
                        })}
                        onClick={() => setGroup("object")}
                    >
                        Group by Object
                    </div>

                    <div
                        className={cx("option", {
                            selected: group === "message",
                        })}
                        onClick={() => setGroup("message")}
                    >
                        Group by Alert
                    </div>
                </div>
            )}
        </div>
    )
}

export default AlertView
