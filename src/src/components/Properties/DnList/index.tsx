import React from 'react'
import { DnShortcutComponent } from '../../DnShortcutComponent'
import { isEmptyArray } from '../../../utils/util'

import { Config } from './types'
import { DnOptions } from '../../../types'

export const DnList = ({ config, options }: { config: Config[], options?: DnOptions }) => {
    return (
        <>
            {!isEmptyArray(config) &&
                config.map((item: Config, index: number) => (
                    <DnShortcutComponent
                        key={index}
                        dn={item.dn}
                        options={options}
                        errors={item.alertCount.error}
                        warnings={item.alertCount.warn}
                    />
                ))}
        </>
    )
}
