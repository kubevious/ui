import { MarkerPreview } from "@kubevious/ui-rule-engine"
import React from "react"
import { MarkersList, SearchState, SearchValue } from "../types"
import cx from "classnames"
import { Search } from "../"
import _ from "lodash"
import { EditorItem } from "../../../types"
import { isEmptyArray } from "../../../utils/util"

export const SearchMarkers = ({
    markers,
    searchValue,
    self,
}: {
    markers: MarkersList,
    searchValue: SearchValue
    self: Search
}) => {

    //***
    //e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    //***
    const handleMarkerFilterChange = (title: string): void => {
        self.setState(
            (prevState: SearchState) => {
                const newMarker: EditorItem = _.filter(
                    self.markers.values,
                    (marker: EditorItem) => marker.name === title
                )[0]
                if (!newMarker.name) {
                    return prevState
                }

                const valueInState = prevState.value
                const savedFilters = prevState.savedFilters
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
                        delete (value as any).markers
                    }

                    if (!isEmptyArray(savedMarkers)) {
                        delete savedFilters.markers

                        return {
                            ...prevState,
                            savedFilters,
                            value,
                        }
                    }

                    return {
                        ...prevState,
                        savedFilters,
                        value,
                    }
                }
                const changedMarkers = valueInState.markers ? [...valueInState.markers, newMarker.name] : [newMarker.name]

                if (!isEmptyArray(savedMarkers)) {
                    return {
                        ...prevState,
                        savedFilters: { ...savedFilters, markers: savedMarkers },
                        value: { ...valueInState, markers: savedMarkers },
                    }
                }
                delete savedFilters.markers

                if (isEmptyArray(changedMarkers)) {
                    delete valueInState.markers
                    return {
                        ...prevState,
                        savedFilters,
                        value: valueInState,
                    }

                }

                return {
                    ...prevState,
                    savedFilters,
                    value: { ...valueInState, markers: changedMarkers },
                }
            },
            () => {
                self.fetchResults(self.state.value)
            }
        )
    }

    return (
        <details open key={markers.payload}>
            <summary
                className={cx("filter-list inner", {
                    "is-active": !!searchValue[markers.payload],
                })}
            >
                {markers.shownValue}
            </summary>
            <div className="inner-items">
                {markers.values &&
                    markers.values.map((item) => {
                        return (
                            <button
                                title={item.name}
                                key={item.name}
                                className={
                                    searchValue.markers &&
                                        searchValue.markers.find((marker) => marker === item.name)
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
        </details>)
}
