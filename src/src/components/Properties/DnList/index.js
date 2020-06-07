import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'
import { isEmptyArray } from '../../../utils/util'

import './styles.scss'
import DnComponent from '../../DnComponent'

const DnList = ({ group, options, hidePopup, dn }) => {
    return (
        <div className="DnList-container">
            {dn && <div className="container-header">
                <DnComponent dn={dn} />
                <h3>Shared With</h3>
            </div>}
            {!isEmptyArray(group.config) && group.config.map((item, index) => (
                <DnShortcutComponent key={index} dn={item} options={options} hidePopup={hidePopup}/>
            ))}
        </div>
    )
}

export default DnList
