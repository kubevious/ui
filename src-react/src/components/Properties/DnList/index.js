import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'
import { isEmptyArray } from '../../../utils/util'

import './styles.scss'

const DnList = ({ group, options, sharedState }) => {
    return (
        <div className="DnList-container">
            {!isEmptyArray(group.config) && group.config.map((item, index) => (
                <DnShortcutComponent key={index} dn={item} options={options} sharedState={sharedState}/>
            ))}
        </div>
    )
}

export default DnList
