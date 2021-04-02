import React from "react"
import cx from "classnames"
// import { SearchFilterItem } from "../SearchFilterItem"
import { FilterItem } from "../types"
import { sharedState } from "../../../configureService"


export const SearchFilterExpander: React.FunctionComponent<{filter: FilterItem}> = ({
    filter,
    children
}) => {
    const value = sharedState.get('search_value') || {}
    return (
        <details open key={filter.payload}>
            <summary
                className={cx("filter-list inner", {
                    "is-active": !!value[filter.payload],
                })}
            >
                {filter.title}
            </summary>

            {children}
        </details>
    )
}
