import React, { FC } from "react"
import { FILTER_ENTRIES_WARNINGS } from "../../constants"
import { FilterComponentProps, FilterEntry } from "../../types"

export const SearchWarnings: FC<FilterComponentProps> = ({
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
            {FILTER_ENTRIES_WARNINGS.map((option, index) => (
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
