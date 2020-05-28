import React from 'react'
import DnShortcutComponent from '../DnShortcutComponent'

const AffectedObjects = ({ selectedRuleData, state }) => {
    return(
        <>
            {selectedRuleData.items.map((item, index) => (
                <DnShortcutComponent key={index} dn={item.dn} state={state}/>
            ))}
        </>
    )
}

export default AffectedObjects