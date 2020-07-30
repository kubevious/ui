import React, { useState } from 'react'
import { parseDn } from '../../../utils/naming-utils';
import cx from 'classnames'
import { prettyKind } from '../../../utils/ui-utils';
import { sortSeverity, uniqueMessages, uniqueObjects } from '../../../utils/util';

const AlertView = ({ alerts, clickDn, openRule }) => {
    const [group, setGroup] = useState('no')

    const clickMessage = (alert) => {
        if (alert.source.kind === 'rule') {
            openRule(alert.source.name)
        }
    }

    const renderAlert = ({ alert, shouldRenderDn = true }) => {
        return (
            <div className="alert-detail" key={alert.id}>
                <div className="message-container" onClick={() => clickMessage(alert)}>
                    <div className={'alert-item ' + alert.severity} />
                    {alert.msg}
                </div>

                {shouldRenderDn && renderDnParts(alert.dn)}
            </div>
        )
    }

    const renderDnParts = (dn) => {
        const dnParts = parseDn(dn).slice(1)

        return (
            <div className="dn-container" key={dn} onClick={() => clickDn(dn)}>
                <img className="dn-logo" src="/img/entities/ns.svg" alt="logo" />
                {dnParts.map(part => (
                    <span className="dn-part" key={part.name}>
                        {prettyKind(part.kind)} {part.name}
                    </span>
                ))}
            </div>
        )
    }

    const renderMessageGroup = () => {
        const messages = uniqueMessages(alerts.map(({ msg, severity, source }) => ({ msg, severity, source })))
            .map(m => ({
                ...m,
                alerts: alerts.filter(a => a.severity === m.severity && a.msg === m.msg),
            })).sort(sortSeverity)

        return (
            <>
                {messages.map((message, index) => (
                    <div className="message-group-container" key={index}>
                        <div className="message-container" onClick={() => clickMessage(message)}>
                            <div className={'alert-item ' + message.severity} />
                            {message.msg}
                        </div>

                        <div className="message-objects">
                            {message.alerts.map(alert => renderDnParts(alert.dn))}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    const renderObjectGroup = () => {
        const objects = uniqueObjects(alerts.map(({ dn }) => ({ dn })))
            .map(o => ({
                ...o,
                alerts: alerts.filter(a => a.dn === o.dn),
            }))

        return (
            <>
                {objects.map((object, index) => (
                    <div className="message-group-container" key={index}>
                        <div className="object-container">
                            {renderDnParts(object.dn)}
                        </div>

                        <div className="message-objects">
                            {object.alerts.map(alert => renderAlert({ alert, shouldRenderDn: false }))}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className="AlertView-container">

            <div className="alerts">
                {group === 'no' && <>
                    {alerts.map(alert => renderAlert({ alert }))}
                </>}

                {group === 'message' && renderMessageGroup()}

                {group === 'object' && renderObjectGroup()}
            </div>


            <div className="group-options">
                <div
                    className={cx('option', { 'selected': group === 'no' })}
                    onClick={() => setGroup('no')}
                >
                    No Group
                </div>

                <div
                    className={cx('option', { 'selected': group === 'object' })}
                    onClick={() => setGroup('object')}
                >
                    Group by Object
                </div>

                <div
                    className={cx('option', { 'selected': group === 'message' })}
                    onClick={() => setGroup('message')}
                >
                    Group by Message
                </div>
            </div>
        </div>
    )
}

export default AlertView
