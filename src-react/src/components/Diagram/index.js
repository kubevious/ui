import React, { PureComponent } from 'react'
import VisualView from './visual-view'
import * as d3 from 'd3'
import $ from 'jquery'

import './styles.css'
import '../Popup/styles.css'

class Diagram extends PureComponent {
    constructor(props) {
        super(props)

        this.view = null

        props.sharedState.subscribe('diagram_data',
            (diagram_data) => {
                if (diagram_data) {
                    this._acceptSourceData(diagram_data);
                }
            })
    }

    get service() {
        return this.props.service
    }

    componentDidMount() {
        this.setupView()

        $('.lm_content').each(function () {
            if ($(this).children().hasClass('diagram')) {
                $(this).css('overflow', 'hidden')
            }
        })
    }

    selectDiagramItem(dn) {
        this.view.selectNodeByDn(dn);
    }

    _acceptSourceData(sourceData) {
        this.massageSourceData(sourceData)
        this._sourceData = sourceData

        this._renderData()
    }

    massageSourceData(data) {
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
        this.view = new VisualView(d3.select('#diagram'), this.props.sharedState);
        this.view.skipShowRoot()
        this.view.setup()
        this._renderData()
    }

    _renderData() {
        if (!this.view) {
            return
        }
        if (this._sourceData) {
            this.view.acceptSourceData(this._sourceData)
        }
        this.view.updateAll(true);
    }

    render() {
        return (
            <div id="diagram" className="diagram"/>
        )
    }

}

export default Diagram
