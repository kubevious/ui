import React from "react"
import cx from "classnames"
import { FilterItem } from "../types"
import { sharedState } from "../../../configureService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"


export const SearchFilterExpander: React.FunctionComponent<{filter: FilterItem, removeAllFilters: (e) => void}> = ({
    filter,
    removeAllFilters,
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
                <FontAwesomeIcon className="clearButton" icon={faTrash} onClick={(e) => removeAllFilters(e)} />
            </summary>

            {children}
        </details>
    )
}
