import React from 'react'
import { Config } from './types'
import { DnShortcutComponent } from '../../DnShortcutComponent'

export const PropertiesObjectList = ({ config }: { config: Config[] }) => {
    return (
        <>
            {config.map((element: Config) => (
                <div key={element.dn}>
                    <DnShortcutComponent
                        dn={element.dn}
                        errors={element.alertCount.error}
                        warnings={element.alertCount.warn}
                    />
                </div>
            ))}
        </>
    )
}
