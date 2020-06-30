import React from 'react'
import DnShortcutComponent from '../DnShortcutComponent'

const AffectedObjects = ({ selectedItemData }) => {
    return (
        <>
            {selectedItemData.items.map((item, index) => (
                <DnShortcutComponent key={index} dn={item.dn} markers={item.markers} errors={item.errors} warnings={item.warnings}/>
            ))}
        </>
    )
}

export default AffectedObjects
