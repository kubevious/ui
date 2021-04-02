import React, { FC, useEffect, useState } from "react"
import { isEmptyArray, isEmptyObject } from "../../../utils/util"
import { FilterObjectType, FilterType, SearchValue } from "../types"
import cx from "classnames"
import { prettyKind } from "../../../utils/ui-utils"
import { checkForInputFilter, keyCheck } from "../util"
import { sharedState } from "../../../configureService"

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
        return (
            <div
                className={cx("active-filter-box", {
                    deactivated: !val.isActiveFilter,
                })}
                key={val.caption}
            >
                <span className="filter-key">{`${val.searchId}: `}</span>
                <span className="filter-val">{val.caption}</span>
                {checkForInputFilter(val.searchId) && (
                    <button
                        className="filter-btn edit"
                        onClick={() => handleEditFilter(val.searchId, val.filterId, val.value)}
                    ></button>
                )}
                <button
                    className={cx("filter-btn toggle-show", {
                        hide: !val.isActiveFilter,
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
            <div>{JSON.stringify(activeFilters, null, 4)}</div>
            <>{activeFilters.map((val) => renderActiveFilters(val))}</>
        </div>
    )
}
