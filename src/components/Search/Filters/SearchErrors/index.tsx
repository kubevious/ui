import React, { FC } from "react"
import { FilterComponentProps } from "../../types"
import { alertsEnum } from "../../search-metadata"

export const SearchErrors: FC<FilterComponentProps> = ({
    data,
    addFilter,
    removeFilter,
    removeAllFilters,
}) => {
    const selectedErrors = data.filters?.errors?.caption

    const handleFilterChange = (title: {
        kind: string
        count: number
    }): void => {
        title.kind === selectedErrors
            ? removeFilter("errors")
            : addFilter("errors", title.kind, title)
    }

    return (
        <div className="inner-items">
            <button
                key="With errors"
                className={
                    alertsEnum[1] === selectedErrors
                        ? "selected-filter"
                        : ""
                }
                onClick={() =>
                    handleFilterChange({
                        kind: alertsEnum[1],
                        count: 1,
                    })
                }
            >
                With errors
            </button>
            <button
                key="Without errors"
                className={
                    alertsEnum[0] === selectedErrors
                        ? "selected-filter"
                        : ""
                }
                onClick={() =>
                    handleFilterChange({
                        kind: alertsEnum[0],
                        count: 0,
                    })
                }
            >
                Without errors
            </button>
        </div>
    )
}
