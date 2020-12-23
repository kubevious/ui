import React from 'react'
import DnShortcutComponent from '../../DnShortcutComponent'

const PropertiesObjectList = ({ options }) => {
    return (
        <>
                {options.map(element => (
                    <div>
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
