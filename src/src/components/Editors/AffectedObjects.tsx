import React from "react"
import { SelectedData } from "../../types"
import { DnShortcutComponent } from '@kubevious/ui-components';
import { SelectedItemData } from "./types"

export const AffectedObjects = ({
    selectedItemData,
}: {
    selectedItemData: SelectedItemData
}): JSX.Element => {
    return (
        <>
            {selectedItemData.items.map((item: SelectedData, index: number) => (
                <DnShortcutComponent
                    dn={item.dn}
                    markers={item.markers}
                    errors={item.errors}
                    warnings={item.warnings}
                />
            ))}
        </>
    )
}
