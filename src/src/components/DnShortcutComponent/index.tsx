import React from "react"
import { isEmptyArray } from "../../utils/util"
import { MarkerDict } from "./types"
import { SelectedData } from "../../types"
import { sharedState } from "../../configureService"
import { DnComponent } from "../DnComponent"
import { MarkerPreview } from "../MarkerPreview"

import "./styles.scss"

export const DnShortcutComponent: React.FunctionComponent<SelectedData> = ({
    dn,
    options,
    errors,
    warnings,
    markers,
}) => {
    const clickDn = (): void => {
        sharedState.set("selected_dn", dn)
        sharedState.set("auto_pan_to_selected_dn", true)
        sharedState.set("popup_window", null)
    }
    // ***
    // Example markerDict
    // markerDict = {
    //   markerName: MarkerDict
    // }
    // ***
    const markerDict = sharedState.get("markers_dict") || {}

    let markerItems: MarkerDict[] = []
    if (markers) {
        markerItems = markers
            .map((x: React.Key) => markerDict[x])
            .filter((x) => x)
    }

    return (
        <div className="dn-shortcut" onClick={() => clickDn()}>
            <DnComponent dn={dn} options={options} />

            <div className="dn-alert">
                {!isEmptyArray(markers) &&
                    markerItems.map(({ shape, color }) => (
                        <div className="marker">
                            <MarkerPreview
                                key={shape}
                                shape={shape}
                                color={color}
                            />
                        </div>
                    ))}
                {errors > 0 && (
                    <div className="indicator error-object">
                        {errors > 1 && errors}
                    </div>
                )}
                {warnings > 0 && (
                    <div className="indicator warning-object">
                        {warnings > 1 && warnings}
                    </div>
                )}
            </div>
        </div>
    )
}
