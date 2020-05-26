import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'
import { isEmptyArray } from '../../../utils/util'

import './styles.scss'

const DnList = ({ group, options, state }) => {
    return (
        <div className="DnList-container">
            {!isEmptyArray(group.config) && group.config.map((item, index) => (
                <DnShortcutComponent key={index} dn={item} options={options} state={state}/>
            ))}
        </div>
    )
}

export default DnList
