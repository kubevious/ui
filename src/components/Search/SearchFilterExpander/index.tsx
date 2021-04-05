import React from "react"
import cx from "classnames"
import { FilterItem } from "../types"
import { sharedState } from "../../../configureService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"


export const SearchFilterExpander: React.FunctionComponent<{filter: FilterItem, removeAllFilters: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void}> = ({
    filter,
    removeAllFilters,
    children
}) => {
    const activedFilters = sharedState.get('actived_filters') || []
    const isActive = activedFilters.includes(filter.payload)
    return (
        <details open key={filter.payload}>
            <summary
                className={cx("filter-list inner", {
                    "is-active": isActive,
                })}
            >
                {filter.title}
                {isActive && <FontAwesomeIcon className="clearButton" icon={faTrash} onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => removeAllFilters(e)} />}
            </summary>

            {children}
        </details>
    )
}
