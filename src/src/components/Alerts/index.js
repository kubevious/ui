import React from 'react'
import BaseComponent from '../../HOC/BaseComponent'
import AlertView from './AlertView'
import { isEmptyArray, sortSeverity } from '../../utils/util'

import './styles.scss'

class Alerts extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            alerts: [],
        }

        this.clickDn = this.clickDn.bind(this)
    }

    componentDidMount() {
        this.subscribeToSharedState('selected_object_alerts',
            selected_object_assets => {
                this.setState({ alerts: selected_object_assets })
            })
    }

    clickDn(dn) {
        this.sharedState.set('selected_dn', dn);
        this.sharedState.set('auto_pan_to_selected_dn', true);
    }

    render() {
        const { alerts } = this.state

        return (
            <div id="alertsComponent">
                {!isEmptyArray(alerts) && <AlertView alerts={alerts.sort(sortSeverity)} clickDn={this.clickDn} />}
            </div>
        )
    }
}

export default Alerts
