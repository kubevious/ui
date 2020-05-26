import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import $ from 'jquery'
import AlertTable from './AlertTable'

import './styles.css'

class Alerts extends Component {
    constructor(props) {
        super(props)

        props.state.subscribe("selected_object_alerts", 
            selected_object_assets => {

            this._renderAlertsTable(selected_object_assets)
        })
    }

    _renderAlertsTable(alerts = []) {
        var html = renderToString(<AlertTable alerts={alerts}/>)
        $('#alerts').html(html)
    }

    render() {
        return (
            <div id="alerts"/>
        )
    }
}

export default Alerts
