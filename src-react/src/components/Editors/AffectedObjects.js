import React from 'react'
import DnShortcutComponent from '../DnShortcutComponent'

const AffectedObjects = ({ selectedItemData, state }) => {
    return(
        <>
            {selectedItemData.items.map((item, index) => (
                <DnShortcutComponent key={index} dn={item.dn} state={state} error={item.has_error} warning={item.has_warning}/>
            ))}
        </>
    )
}

export default AffectedObjects