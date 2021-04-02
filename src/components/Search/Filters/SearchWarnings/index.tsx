import React, { FC } from "react"
import { FilterComponentProps } from "../../types"

export const SearchWarnings : FC<FilterComponentProps> = ({ data, addFilter, removeFilter, removeAllFilters }) => {
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
            { FILTER_ENTRIES.map((option, index) => 
                <button
                    key={index}
                    className={
                        option.caption === selectedFilter
                            ? "selected-filter"
                            : ""
                    }
                    onClick={() =>
                        handleFilterChange(option)
                    }
                >
                    {option.caption}
                </button>
            )}
        </div>
    )
}


interface FilterEntry
{
    caption: string,
    value: any
}

const FILTER_ENTRIES : FilterEntry[] = [
    {
        caption: 'With warnings',
        value: {
            kind: "at-least",
            count: 1,
        }
    },
    {
        caption: 'Without warnings',
        value: {
            kind: "at-most",
            count: 0,
        }
    },
]