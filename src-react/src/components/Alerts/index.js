import React, { PureComponent } from 'react'
import AlertTable from './AlertTable'
import { isEmptyArray } from '../../utils/util'

import './styles.css'

class Alerts extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            alerts: []
        }
    }

    get service() {
        return this.props.service
    }

    componentDidMount() {
        this.props.sharedState.subscribe('selected_object_alerts',
            selected_object_assets => {
                this.setState({ alerts: selected_object_assets })
            })
    }

    render() {
        const { alerts } = this.state

        return (
            <div id="alerts">
                {!isEmptyArray(alerts) && <AlertTable alerts={alerts}/>}
            </div>
        )
    }
}

export default Alerts
