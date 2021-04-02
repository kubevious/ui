import React, { FC } from "react"
import { FilterComponentProps } from "../../types"
import { alertsEnum } from "../../search-metadata"

export const SearchWarnings : FC<FilterComponentProps> = ({ data, addFilter, removeFilter, removeAllFilters }) => {
    const selectedWarning = data.filters?.warnings?.caption

    const handleFilterChange = (
        title: { kind: string; count: number }
      ): void => {
        title.kind === selectedWarning
            ? removeFilter("warnings")
            : addFilter("warnings", title.kind, title)
      }

    return (
        <div className="inner-items">
            <button
                key='With warnings'
                className={
                    alertsEnum[1] === selectedWarning
                        ? "selected-filter"
                        : ""
                }
                onClick={() =>
                    handleFilterChange({
                        kind: alertsEnum[1],
                        count: 1
                    })
                }
            >
                With warnings
            </button>
            <button
                key='Without warnings'
                className={
                    alertsEnum[0] === selectedWarning
                        ? "selected-filter"
                        : ""
                }
                onClick={() =>
                    handleFilterChange({
                        kind: alertsEnum[0],
                        count: 0
                    })
                }
            >
                Without warnings
            </button>
        </div>
    )
}
