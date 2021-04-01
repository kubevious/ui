import React, { useState, useEffect } from "react"
import { MarkerPreview } from "@kubevious/ui-rule-engine"
import { MarkersList, SearchValue } from "../../types"
import _ from "lodash"
import { EditorItem } from "../../../../types"
import { isEmptyArray } from "../../../../utils/util"
import { sharedState } from "../../../../configureService"
import { fetchSearchResult } from "../../util"

export const SearchMarkers = () => {
    const [searchValue, setSearchValue] = useState<SearchValue>({})
    const [markers, setMarkers] = useState<MarkersList>({
        payload: "markers",
        shownValue: "Markers",
        values: [],
    })

    useEffect(() => {
        const searchValue = sharedState.get("search_value") || {}
        setSearchValue(searchValue)

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

        const valueInState = sharedState.get("search_value") || {}
        const savedFilters = sharedState.get("saved_filters") || {}
        const markerExists = _.filter(
            valueInState.markers,
            (marker: string) => marker === newMarker.name
        )

        const savedMarkers = _.filter(
            savedFilters.markers,
            (marker: string) => marker !== newMarker.name
        )

        if (!isEmptyArray(markerExists)) {
            const filteredMarkers = _.filter(
                valueInState.markers || savedFilters.markers,
                (marker: string) => marker !== newMarker.name
            )
            const value = { ...valueInState, markers: filteredMarkers }

            if (isEmptyArray(filteredMarkers)) {
                delete value.markers
            }

            if (!isEmptyArray(savedMarkers)) {
                delete savedFilters.markers
            }

            sharedState.set("search_value", value)
            sharedState.set("saved_filters", savedFilters)

            return
        }

        const changedMarkers = valueInState.markers
            ? [...valueInState.markers, newMarker.name]
            : [newMarker.name]

        if (!isEmptyArray(savedMarkers)) {
            sharedState.set("search_value", {
                ...valueInState,
                markers: savedMarkers,
            })
            sharedState.set("saved_filters", {
                ...savedFilters,
                markers: savedMarkers,
            })

            return
        }

        delete savedFilters.markers

        if (isEmptyArray(changedMarkers)) {
            delete valueInState.markers

            sharedState.set("search_value", valueInState)
            sharedState.set("saved_filters", savedFilters)

            return
        }

        sharedState.set("search_value", {
            ...valueInState,
            markers: changedMarkers,
        })
        sharedState.set("saved_filters", savedFilters)

        return
    }

    const handleMarkerFilterChange = (title: string): void => {
        markerFilterChange(title)
        fetchSearchResult()
    }

    return (
            <div className="inner-items">
                {markers.values &&
                    markers.values.map((item) => {
                        return (
                            <button
                                title={item.name}
                                key={item.name}
                                className={
                                    searchValue.markers &&
                                    searchValue.markers.find(
                                        (marker) => marker === item.name
                                    )
                                        ? "selected-filter"
                                        : ""
                                }
                                onClick={() =>
                                    handleMarkerFilterChange(item.name || "")
                                }
                            >
                                <MarkerPreview
                                    shape={item.shape}
                                    color={item.color}
                                />
                                {item.name}
                            </button>
                        )
                    })}
            </div>
    )
}
