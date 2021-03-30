import React from "react"
import { isEmptyObject } from "../../../utils/util"
import { FilterObjectType, FilterType, SearchValue } from "../types"
import cx from "classnames"
import { prettyKind } from "../../../utils/ui-utils"

export const SearchFilter = ({
    value,
    savedFilters,
    checkForInputFilter,
    keyCheck,
    handleEditFilter,
    toggleFilter,
    deleteFilter
}: {
    value: SearchValue,
    savedFilters: SearchValue,
    checkForInputFilter: (payload: string) => boolean
    keyCheck: (el: FilterType, key: string) => boolean
    handleEditFilter: (type: string, filterVal: FilterType) => void
    toggleFilter: (type: string, filterVal: FilterType) => void
    deleteFilter: (key: string, val: FilterType) => boolean
}) => {

    const renderPrettyView = (val: FilterObjectType) => {
        const { key, value, kind, count } = val
        if (kind) {
            return `${kind}: ${count}`
        }
        return val && Array.isArray(val)
            ? val.map((criteria, index) =>
                index === val.length - 1 ? criteria : `${criteria} | `
            )
            : `${key}: ${value && value.substring(0, 50)}`
    }

    const compareForSort = (a: { key: string }, b: { key: string }) => {
        let valA = a.key.toUpperCase()
        let valB = b.key.toUpperCase()

        let comparison = 0
        if (valA > valB) {
            comparison = 1
        } else if (valA < valB) {
            comparison = -1
        }
        return comparison
    }

    // val: FilterType
    const renderDividedActiveFilters = (
        key: string,
        val: any,
    ) => {
        if (!val) {
            return
        }

        const saved = savedFilters[key] || []
        const sumOfValues = value[key] ? value[key].concat(saved) : saved

        return (
            sumOfValues.sort(compareForSort) &&
            sumOfValues.sort(compareForSort).map((filter: FilterObjectType) => {
                if (!isEmptyObject(filter)) {
                    return renderActiveFilters(key, filter)
                }
                return
            })
        )
    }

    // val: FilterType
    const renderActiveFilters = (type: string, val: any) => {
        const key = typeof val !== "string" && val.key ? val.key : null
        const checkInSavedFilters =
            !!savedFilters[type] && !!key
                ? savedFilters[type].find((el: FilterType) => keyCheck(el, key))
                : savedFilters[type]
        if (!val) return
        return (
            <div
                className={cx("active-filter-box", {
                    deactivated: checkInSavedFilters,
                })}
                key={type}
            >
                <span className="filter-key">{`${type}: `}</span>
                <span className="filter-val">
                    {typeof val === "string"
                        ? prettyKind(val)
                        : renderPrettyView(val)}
                </span>
                {checkForInputFilter(type) && (
                    <button
                        className="filter-btn edit"
                        onClick={() => handleEditFilter(type, val)}
                    ></button>
                )}
                <button
                    className={cx("filter-btn toggle-show", {
                        hide: checkInSavedFilters,
                    })}
                    title="Toggle show/hide"
                    onClick={() => toggleFilter(type, val)}
                />
                <button
                    className="filter-btn del"
                    title="Delete"
                    onClick={() => deleteFilter(type, val)}
                >
                    &times;
        </button>
            </div>
        )
    }


    return (
        <div className="active-filters">
            {(!isEmptyObject(value) || !isEmptyObject(savedFilters)) &&
                Object.entries(Object.assign({}, value, savedFilters)).sort() && (
                    <>
                        {Object.entries(Object.assign({}, value, savedFilters))
                            .sort()
                            .map(
                                ([key, val]) =>
                                    key !== "criteria" &&
                                    (checkForInputFilter(key) && val
                                        ? renderDividedActiveFilters(key, val)
                                        : renderActiveFilters(key, val))
                            )}
                    </>
                )}
        </div>)
}