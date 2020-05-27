import React from 'react'
import $ from 'jquery'
import DnComponent from '../DnComponent'
import {
    popupClose
} from '../../utils/ui-utils'

import './styles.scss'

const DnShortcutComponent = ({ dn, options, state, hidePopup }) => {
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
        </div>
    )
}


export default DnShortcutComponent
