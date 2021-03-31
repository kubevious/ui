import React from "react"
import cx from "classnames"
import { SearchFilterItemProps } from "../types"
import { SearchFilterItem } from "../SearchFilterItem"


export const SearchFilterExpander: React.FunctionComponent<SearchFilterItemProps> = ({
    value,
    el,
    parent,
    checkForInputFilter,
    handleFilterChange,
    autocomplete,
    currentInput,
}) => {
    return (
        <details open key={el.payload}>
            <summary
                className={cx("filter-list inner", {
                    "is-active": !!value[el.payload],
                })}
            >
                {el.shownValue}
            </summary>
            <SearchFilterItem
                value={value}
                el={el}
                parent={parent}
                checkForInputFilter={checkForInputFilter}
                handleFilterChange={handleFilterChange}
                autocomplete={autocomplete}
                currentInput={currentInput}
            />
        </details>
    )
}
