import React from 'react'
import { SelectedData } from '../../types'
import DnShortcutComponent from '../DnShortcutComponent'
import { SelectedItem } from './types'

const AffectedObjects = ({ selectedItemData }:  { selectedItemData: SelectedItem }): JSX.Element => {
    return (
        <>
            {selectedItemData.items.map((item: SelectedData, index: number) => (
                <DnShortcutComponent key={index} dn={item.dn} markers={item.markers} errors={item.errors} warnings={item.warnings}/>
            ))}
        </>
    )
}
export default AffectedObjects

