import React, { Component } from 'react'
import AlertTable from './AlertTable'

import './styles.css'
import { isEmptyArray } from '../../utils/util'

class Alerts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            alerts: []
        }
    }

    componentDidMount() {
        this.props.state.subscribe('selected_object_alerts',
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
