import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'
import { isEmptyArray } from '../../../utils/util'

import './styles.scss'

const DnList = ({ group, options }) => {
    return (
        <>
            {!isEmptyArray(group.config) &&
                group.config.map((item, index) => (
                    <DnShortcutComponent
                        key={index}
                        dn={item}
                        options={options}
                    />
                ))}
        </>
    )
}

export default DnList
