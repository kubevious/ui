import React from "react"
import { DnShortcutComponent } from "../../DnShortcutComponent"
import { isEmptyArray } from "../../../utils/util"

import { DnOptions } from "../../../types"

export const DnList = ({
    config,
    options,
}: {
    config: string[]
    options?: DnOptions
}): JSX.Element => {
    return (
        <>
            {!isEmptyArray(config) &&
                config.map((item: string, index: number) => (
                    <DnShortcutComponent
                        key={index}
                        dn={item}
                        options={options}
                    />
                ))}
        </>
    )
}
