import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'
import { isEmptyArray } from '../../../utils/util'
import DnComponent from '../../DnComponent'

import './styles.scss'

const DnList = ({ group, options, hidePopup, dn }) => {
    return (
        <div className="DnList-wrapper p-40 overflow-hide">
            <div className="DnList-container">
                {dn && <div className="container-header">
                    <DnComponent dn={dn} />
                    <h3>Shared With</h3>
                </div>}
                {!isEmptyArray(group.config) && group.config.map((item, index) => (
                    <DnShortcutComponent key={index} dn={item} options={options} hidePopup={hidePopup} />
                ))}
            </div>
        </div>
    )
}

export default DnList
