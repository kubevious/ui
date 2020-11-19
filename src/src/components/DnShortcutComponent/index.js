import React from 'react'
import DnComponent from '../DnComponent'
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
        this.sharedState.set('popup_window', null);
    }

    render() {
        const { dn, options, errors, warnings, markers } = this.props

        var markerDict = this.sharedState.get('markers_dict');
        if (!markerDict) {
            markerDict = {};
        }

        var markerItems = [];
        if (markers) {
            markerItems = markers.map(x => markerDict[x]);
            markerItems = markerItems.filter(x => x);
        }

        return (
            <div className="dn-shortcut" dn={dn} onClick={this.clickDn}>
                <DnComponent dn={dn} options={options} />

                <div className="dn-alert">
                    {!isEmptyArray(markers) && markerItems.map(({ shape, color }) => (
                        <div className="marker">
                            <MarkerPreview key={shape} shape={shape} color={color} />
                        </div>
                    ))}
                    {errors > 0 && <div className="indicator error-object">{errors > 1 && errors}</div>}
                    {warnings > 0 && <div className="indicator warning-object">{warnings > 1 && warnings}</div>}
                </div>
            </div>
        );
    }

}


export default DnShortcutComponent
