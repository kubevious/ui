import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'

export const PropertiesObjectList = ({ config }) => {
    return (
        <>
            {config.map((element) => (
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
