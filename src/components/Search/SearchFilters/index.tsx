import React, { FC } from "react"
import cx from "classnames"
import { sharedState } from "../../../configureService"

import { FILTERS_LIST } from "../search-metadata"
import { FilterValue } from "../types"

export const SearchFilters: FC<{
    activeFilters: FilterValue[]
    removeFilter: (searchId: string, filterId: string) => void
    toogleVisibilityFilter: (searchId: string, filterId: string) => void
}> = ({ activeFilters, removeFilter, toogleVisibilityFilter }) => {
    const handleEditFilter = (type: string, filter: string, value : any): void => {
        sharedState.set(`edited_filter_${type}`, {
                filter,
                value
        })
    }

    const renderActiveFilters = (val: FilterValue) => {
        const filterComponent = FILTERS_LIST
            .filter(filterValue => 
                filterValue.searchId === val.searchId
            )[0]

        return (
            <div
                className={cx("active-filter-box", {
                    deactivated: !val.isEnabled,
                })}
                key={val.caption}
            >
                <span className="filter-key">{`${val.searchId}: `}</span>
                <span className="filter-val">{val.caption}</span>
                {filterComponent.isEditable && (
                    <button
                        className="filter-btn edit"
                        onClick={() => handleEditFilter(val.searchId, val.filterId, val.value)}
                    ></button>
                )}
                <button
                    className={cx("filter-btn toggle-show", {
                        hide: !val.isEnabled,
                    })}
                    title="Toggle show/hide"
                    onClick={() =>
                        toogleVisibilityFilter(val.searchId, val.filterId)
                    }
                />
                <button
                    className="filter-btn del"
                    title="Delete"
                    onClick={() => removeFilter(val.searchId, val.filterId)}
                >
                    &times;
                </button>
            </div>
        )
    }

    return (
        <div className="active-filters">
            <>{activeFilters.map((val) => renderActiveFilters(val))}</>
        </div>
    )
}
