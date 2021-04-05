import React, { FC, useState, useEffect } from "react"
import { MarkerPreview } from "@kubevious/ui-rule-engine"
import { MarkersList } from "./types"
import _ from "lodash"
import { FilterComponentProps } from "../types"
import { sharedState } from "@kubevious/ui-framework/dist/global"
import { EditorItem } from "../../../types"

export const SearchMarkers: FC<FilterComponentProps> = ({
    data,
    addFilter,
    removeFilter,
    removeAllFilters,
}) => {
    const [markers, setMarkers] = useState<MarkersList>({
        payload: "markers",
        shownValue: "Markers",
        values: [],
    })

    useEffect(() => {
        const markersFromState = sharedState.get("marker_editor_items")
        setMarkers({
            payload: "markers",
            shownValue: "Markers",
            values: markersFromState,
        })
    }, [])

    const markerFilterChange = (title: string): void => {
        const newMarker: EditorItem = _.filter(
            markers.values,
            (marker: EditorItem) => marker.name === title
        )[0]

        if (!newMarker.name) {
            return
        }

        addFilter(newMarker.name, `Marker ${newMarker.name}`, true)
    }

    const handleMarkerFilterChange = (title: string): void => {
        const isActive = data.filters[title]
        !!isActive ? removeFilter(title) : markerFilterChange(title)
    }

    return (
        <div className="inner-items">
            {markers.values &&
                markers.values.map((item) => {
                    const name = item.name || ""
                    return (
                        <button
                            title={name}
                            key={name}
                            className={
                                data.filters[name] ? "selected-filter" : ""
                            }
                            onClick={() => handleMarkerFilterChange(name)}
                        >
                            <MarkerPreview
                                shape={item.shape}
                                color={item.color}
                            />
                            {name}
                        </button>
                    )
                })}
        </div>
    )
}
