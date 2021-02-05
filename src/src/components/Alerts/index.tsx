import BaseComponent from '../../HOC/BaseComponent'
import AlertView from './AlertView'
import { isEmptyArray, sortSeverity } from '../../utils/util'
import cx from 'classnames'

import './styles.scss'
import { Messages } from '../../types'

class Alerts extends BaseComponent {
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
        this.subscribeToSharedState('selected_object_alerts',
            (selected_object_alerts: Messages[]) => {
                this.setState({ alerts: selected_object_alerts })
            })
        this.subscribeToSharedState('selected_dn', (selected_dn: string) => {
            if (selected_dn) {
                this.setState({ isDnSelected: true })
            }
        })
    }

    clickDn(dn: string): void {
        this.sharedState.set('selected_dn', dn);
        this.sharedState.set('auto_pan_to_selected_dn', true);
    }

    openRule(ruleName: string): void {
        this.sharedState.set('rule_editor_selected_rule_id', ruleName);
        this.sharedState.set('focus_rule_editor', true);
    }

    renderAlerts(alerts: Messages[]): JSX.Element {
        if (isEmptyArray(alerts)) {
            return this.sharedState.get('selected_dn')
                ? <div className="message-empty">No alerts for selected object.</div>
                : <div className="message-empty">No object selected.</div>
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
        const alerts: Messages[] = this.state.alerts
        return (
            <div id="alertsComponent" className={cx({'empty': isEmptyArray(alerts)})}>
                {this.renderAlerts(alerts)}
            </div>
        )
    }
}

export default Alerts
