import React, { Component } from 'react'
import DnComponent from '../DnComponent'
import {
    popupClose
} from '../../utils/ui-utils'
import BaseComponent from '../../HOC/BaseComponent'

import './styles.scss'

class DnShortcutComponent extends BaseComponent {
    constructor(props) {
        super(props);

        this.clickDn = this.clickDn.bind(this);
    }

    clickDn() {
        this.sharedState.set('selected_dn', this.props.dn);
        this.props.hidePopup ? this.props.hidePopup() : popupClose()
    }

    render() {
        const { dn, options, error, warning } = this.props

        return (
            <div className="dn-shortcut" dn={dn} onClick={this.clickDn}>
                <DnComponent dn={dn} options={options}/>

                <div className="dn-alert">
                    {error > 0 && <div className="alert-item error"/>}
                    {warning > 0 && <div className="alert-item warn"/>}
                </div>
            </div>
        );
    }

}


export default DnShortcutComponent
