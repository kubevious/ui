import React from 'react'
import DnShortcutComponent from '../DnShortcutComponent'

const AffectedObjects = ({ selectedItemData, sharedState }) => {
    console.log(selectedItemData);
    return(
        <>
            {selectedItemData.items.map((item, index) => (
                <DnShortcutComponent key={index} dn={item.dn} sharedState={sharedState} error={item.has_error} warning={item.has_warning}/>
            ))}
        </>
    )
}

export default AffectedObjects