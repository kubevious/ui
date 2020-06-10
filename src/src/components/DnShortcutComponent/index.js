import React from 'react'
import DnComponent from '../DnComponent'
import { popupClose } from '../../utils/ui-utils'
import BaseComponent from '../../HOC/BaseComponent'
import { isEmptyArray } from '../../utils/util'
import MarkerPreview from '../MarkerPreview'

import './styles.scss'

class DnShortcutComponent extends BaseComponent {
    constructor(props) {
        super(props);

        this.clickDn = this.clickDn.bind(this);
    }

    clickDn() {
        this.sharedState.set('selected_dn', this.props.dn);
        this.sharedState.set('auto_pan_to_selected_dn', true);
        this.props.hidePopup ? this.props.hidePopup() : popupClose()
    }

    render() {
        const { dn, options, error, warning, markers } = this.props

        return (
            <div className="dn-shortcut" dn={dn} onClick={this.clickDn}>
                <DnComponent dn={dn} options={options}/>

                <div className="dn-alert">
                    {!isEmptyArray(markers) && markers.map(({ shape, color }) => (
                        <MarkerPreview key={shape} shape={shape} color={color}/>
                    ))}
                    {error > 0 && <div className="alert-item error"/>}
                    {warning > 0 && <div className="alert-item warn"/>}
                </div>
            </div>
        );
    }

}


export default DnShortcutComponent
