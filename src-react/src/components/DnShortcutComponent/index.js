import React, { Component } from 'react'
import DnComponent from '../DnComponent'
import {
    popupClose
} from '../../utils/ui-utils'

import './styles.scss'

class DnShortcutComponent extends Component {
    constructor(props)
    {
        super(props);
        this.sharedState = props.state;

        this.clickDn = this.clickDn.bind(this);
    }

    clickDn()
    {
        this.sharedState.set('selected_dn', this.props.dn);
        popupClose()
    }

    render() {
        return (
            <div className="dn-shortcut" dn={this.props.dn} onClick={this.clickDn} >
                <DnComponent dn={this.props.dn} options={this.props.options} />

                <div className="dn-alert">
                    {this.props.error > 0 && <div className="alert-item error"/>}
                    {this.props.warning > 0 && <div className="alert-item warn"/>}
                </div>
            </div>
        );
    }

}


export default DnShortcutComponent
