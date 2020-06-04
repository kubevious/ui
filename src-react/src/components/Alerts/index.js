import React from 'react'
import BaseComponent from '../BaseComponent'
import AlertTable from './AlertTable'
import { isEmptyArray } from '../../utils/util'

import './styles.css'

class Alerts extends BaseComponent {
    constructor(props) {
        super(props)

        this.state = {
            alerts: []
        }
    }

    componentDidMount() {
        this.sharedState.subscribe('selected_object_alerts',
            selected_object_assets => {
                this.setState({ alerts: selected_object_assets })
            })
    }

    render() {
        const { alerts } = this.state

        return (
            <div id="alertsComponent">
                {!isEmptyArray(alerts) && <AlertTable alerts={alerts}/>}
            </div>
        )
    }
}

export default Alerts
