import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import AlertView from './AlertView'
import { isEmptyArray, sortSeverity } from '../../utils/util'
import cx from 'classnames'

import './styles.scss'

class Alerts extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            alerts: [],
        }

        this.clickDn = this.clickDn.bind(this)
        this.openRule = this.openRule.bind(this)
    }

    componentDidMount() {
        this.subscribeToSharedState('selected_object_alerts',
            selected_object_alerts => {
                this.setState({ alerts: selected_object_alerts })
            })

        document.getElementById('alertsComponent').parentElement.style.overflow = 'hidden'
    }

    clickDn(dn) {
        this.sharedState.set('selected_dn', dn);
        this.sharedState.set('auto_pan_to_selected_dn', true);
    }

    openRule(ruleName) {
        this.sharedState.set('rule_editor_selected_rule_id', ruleName);
        this.sharedState.set('focus_rule_editor', true);
    }

    render() {
        const { alerts } = this.state

        return (
            <div id="alertsComponent" className={cx({'empty': isEmptyArray(alerts)})}>
                {isEmptyArray(alerts)
                    ? <div className="message-empty">No object selected.</div>
                    : <AlertView
                        alerts={alerts.sort(sortSeverity)}
                        clickDn={this.clickDn}
                        openRule={this.openRule}
                    />}
            </div>
        )
    }
}

export default Alerts
