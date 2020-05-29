import React from 'react'
import $ from 'jquery'
import DnComponent from '../DnComponent'
import {
    popupClose
} from '../../utils/ui-utils'

import './styles.scss'

const DnShortcutComponent = ({ dn, options, state, hidePopup, error = 0, warning = 0 }) => {
    setTimeout(() => {
        $('.dn-shortcut').on('click', (e) => onPropertyPanelDnClick(e))
    }, 0)

    const onPropertyPanelDnClick = (event) => {
        const dn = $(event.currentTarget).attr('dn');
        state.set('selected_dn', dn);
        hidePopup ? hidePopup() : popupClose()
    }

    return (
        <div className="dn-shortcut" dn={dn}>
            <DnComponent dn={dn} options={options}/>

            <div className="dn-alert">
                {error > 0 && <div className="alert-item error"/>}
                {warning > 0 && <div className="alert-item warn"/>}
            </div>
        </div>
    )
}


export default DnShortcutComponent
