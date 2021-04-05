import React, { FC } from "react"
import { FILTER_ENTRIES_ERRORS } from "../../constants"
import { FilterComponentProps, FilterEntry } from "../../types"

export const SearchErrors: FC<FilterComponentProps> = ({
    data,
    addFilter,
    removeFilter,
}) => {
    const selectedFilter = data.filters?.value?.caption

    const handleFilterChange = (entry: FilterEntry): void => {
        if (entry.caption === selectedFilter) {
            removeFilter("value")
        } else {
            addFilter("value", entry.caption, entry.value)
        }
    }

    return (
        <div className="inner-items">
            {FILTER_ENTRIES_ERRORS.map((option, index) => (
                <button
                    key={index}
                    className={
                        option.caption === selectedFilter
                            ? "selected-filter"
                            : ""
                    }
                    onClick={() => handleFilterChange(option)}
                >
                    {option.caption}
                </button>
            ))}
        </div>
    )
}
