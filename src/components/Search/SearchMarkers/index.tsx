import { MarkerPreview } from "@kubevious/ui-rule-engine"
import React from "react"
import { MarkersList, SearchValue } from "../types"
import cx from "classnames"

export const SearchMarkers = ({
    markers,
    searchValue,
    handleMarkerFilterChange,
}: {
    markers: MarkersList,
    searchValue: SearchValue
    handleMarkerFilterChange: (title: string) => void
}) => {
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
