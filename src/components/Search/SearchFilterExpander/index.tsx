import React from "react"
import cx from "classnames"
import { FilterItem } from "../types"
import { sharedState } from "../../../configureService"


export const SearchFilterExpander: React.FunctionComponent<{filter: FilterItem}> = ({
    filter,
    children
}) => {
    const activedFilters = sharedState.get('actived_filters') || []

    return (
        <details open key={filter.payload}>
            <summary
                className={cx("filter-list inner", {
                    "is-active": activedFilters.includes(filter.payload),
                })}
            >
                {filter.title}
            </summary>

            {children}
        </details>
    )
}
