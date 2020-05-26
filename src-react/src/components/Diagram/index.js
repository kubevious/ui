import React, { Component } from 'react'
import VisualView from './visual-view'
import * as d3 from 'd3'

import './styles.css'
import '../Popup/styles.css'

export var diagramScope = {
    client: null,
    view: null
}

class Diagram extends Component {
    constructor(props) {
        super(props)

        this.view = ''

        props.state.subscribe('diagram_data',
            (diagram_data) => {
                if (diagram_data) {
                    this._acceptSourceData(diagram_data);
                }
            })
    }

    componentDidMount() {
        this.setupView()
    }

    selectDiagramItem(dn) {
        diagramScope.view.selectNodeByDn(dn);
    }

    _acceptSourceData(sourceData) {
        this.massageSourceData(sourceData)
        this._sourceData = sourceData

        this._renderData()
    }

    massageSourceData(data) {
        console.log('data', data)
        this.massageSourceDataNode(data, null)
    }

    massageSourceDataNode(node, parent) {
        var dn
        if (parent) {
            dn = parent.dn + '/' + node.rn
        } else {
            dn = node.rn
        }
        node.dn = dn

        node.alerts = {}
        const ALERT_SEVERITIES = ['error', 'warn']
        for (var severity of ALERT_SEVERITIES) {
            node.alerts[severity] = this._getNodeErrorCount(node, severity)
        }

        if (node.children) {
            for (var child of node.children) {
                this.massageSourceDataNode(child, node)
                // eslint-disable-next-line no-redeclare
                for (var severity of ALERT_SEVERITIES) {
                    node.alerts[severity] += child.alerts[severity]
                }
            }
        }
    }

    _getNodeErrorCount(node, kind) {
        if (node.alertCount) {
            if (node.alertCount[kind]) {
                return node.alertCount[kind]
            }
        } else {
            var propName = kind + 'Count'
            if (node[propName]) {
                return node[propName]
            }
        }
        return 0
    }

    setupView() {
        diagramScope.view = new VisualView(d3.select('#diagram'), this.props.state);
        diagramScope.view.skipShowRoot()
        diagramScope.view.setup()
        this._renderData()
    }

    _renderData() {
        if (!diagramScope.view) {
            return
        }

        if (this._sourceData) {
            diagramScope.view.acceptSourceData(this._sourceData)
        }
        diagramScope.view.updateAll(true)
    }

    _selectDn(dn) {
        throw new Error('zzz');
        this.props.state.set('selected_dn', dn);
    }


    render() {
        return (
            <div id="diagram"/>
        )
    }

}

export default Diagram
