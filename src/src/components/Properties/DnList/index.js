import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'
import { isEmptyArray } from '../../../utils/util'

import './styles.scss'

const DnList = ({ config, options }) => {
    return (
        <>
            {!isEmptyArray(config) &&
                config.map((item, index) => (
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
