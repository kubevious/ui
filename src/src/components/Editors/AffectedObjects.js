import React from 'react'
import DnShortcutComponent from '../DnShortcutComponent'

const AffectedObjects = ({ selectedItemData }) => {
    return (
        <>
            {selectedItemData.items.map((item, index) => (
                <DnShortcutComponent key={index} dn={item.dn} markers={item.markers} error={item.has_error} warning={item.has_warning}/>
            ))}
        </>
    )
}

export default AffectedObjects