import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'

const PropertiesObjectList = ({ config }) => {
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

export default PropertiesObjectList
