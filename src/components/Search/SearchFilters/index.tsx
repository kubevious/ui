import React, { useEffect, useState } from "react"
import { isEmptyArray, isEmptyObject } from "../../../utils/util"
import {
    FilterObjectType,
    FilterType,
    SearchValue,
} from "../types"
import cx from "classnames"
import { prettyKind } from "../../../utils/ui-utils"
import { checkForInputFilter, fetchSearchResult, keyCheck } from "../util"
import { sharedState } from "../../../configureService"

export const SearchFilters = () => {
    const [searchValue, setSearchValue] = useState<SearchValue>({})
    const [savedFilters, setSavedFilters] = useState<SearchValue>({})

    useEffect(() => {
        const savedFilters = sharedState.get("saved_filters") || {}
        setSavedFilters(savedFilters)

        const searchValue = sharedState.get("search_value") || {}
        setSearchValue(searchValue)
    }, [])

    const handleEditFilter = (type: string, filterVal: FilterType): void => {
        const actualCurrentInput = sharedState.get("current_input") || {}
        if (typeof filterVal === "string") {
            sharedState.set("current_input", {
                ...actualCurrentInput,
                [type]: {
                    disabled: true,
                },
            })

            return
        }
        const { key, value } = filterVal
        sharedState.set("current_input", {
            ...actualCurrentInput,
            [type]: {
                key,
                value,
                disabled: true,
            },
        })
    }

    const changeToggleFilter = (type: string, filterVal: FilterType) => {
        const valueInState = sharedState.get("search_value") || {}
        const savedInState = sharedState.get("saved_filters") || {}
        if (!checkForInputFilter(type)) {
            const deleteFromSaved = () => {
                valueInState[type] = savedInState[type]
                delete savedInState[type]
            }

            const addToSaved = () => {
                savedInState[type] = valueInState[type]
                delete valueInState[type]
            }
            savedInState[type] ? deleteFromSaved() : addToSaved()
            sharedState.set("search_value", valueInState)
            sharedState.set("saved_filters", savedInState)
            return
        }

        let valueArray: FilterType[] = valueInState[type] || []
        let savedArray: FilterType[] = savedInState[type] || []
        let changedValueArray: FilterType[] = []
        let changedSavedArray: FilterType[] = []
        if (typeof filterVal !== "string") {
            changedValueArray = valueArray.filter((el) =>
                keyCheck(el, filterVal.key || "")
            )
            changedSavedArray = savedArray.filter((el) =>
                keyCheck(el, filterVal.key || "")
            )
        }
        if (savedInState[type]) {
            const compareLength = changedSavedArray.length === savedArray.length

            savedInState[type] = compareLength
                ? [...savedArray, filterVal]
                : changedSavedArray
            valueInState[type] = compareLength
                ? changedValueArray
                : [...valueArray, filterVal]

            if (isEmptyArray(valueInState[type])) {
                return
            } else if (isEmptyArray(savedInState[type])) {
                delete savedInState[type]
                return
            }

            sharedState.set("search_value", valueInState)
            sharedState.set("saved_filters", savedInState)
            return
        }

        valueInState[type] = changedValueArray
        isEmptyArray(changedValueArray) && delete valueInState[type]
        sharedState.set("search_value", valueInState)
        sharedState.set("saved_filters", {
            ...savedInState,
            [type]: [filterVal],
        })
        return
    }


    const toggleFilter = (type: string, filterVal: FilterType) => {
        changeToggleFilter(type, filterVal)
        fetchSearchResult()
    }

    const handleDeleteFilter = (key: string, val: FilterType) => {
        deleteFilter(key, val)
        fetchSearchResult()
    }

    const deleteFilter = (key: string, val: FilterType) => {
        const valueInState = sharedState.get("search_value") || {}
        const savedInState = sharedState.get("saved_filters") || {}
        const currentFilters = valueInState[key] || []
        const currentSavedFilters = savedInState[key] || []

        if (!checkForInputFilter(key)) {
            valueInState[key] && delete valueInState[key]
            savedInState[key] && delete savedInState[key]

            sharedState.set("search_value", valueInState)
            sharedState.set("saved_filters", savedInState)

            return
        }
        if (typeof val !== "string") {
            valueInState[key] = currentFilters.filter((filter: FilterType) =>
                keyCheck(filter, val.key || "")
            )
            savedInState[
                key
            ] = currentSavedFilters.filter((filter: FilterType) =>
                keyCheck(filter, val.key || "")
            )
        }

        isEmptyArray(valueInState[key]) && delete valueInState[key]
        isEmptyArray(savedInState[key]) && delete savedInState[key]

        sharedState.set("search_value", valueInState)
        sharedState.set("saved_filters", savedInState)
    }

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
    const renderDividedActiveFilters = (key: string, val: any) => {
        if (!val) {
            return
        }

        const saved = savedFilters[key] || []
        const sumOfValues = searchValue[key]
            ? searchValue[key].concat(saved)
            : saved

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
                    onClick={() => handleDeleteFilter(type, val)}
                >
                    &times;
                </button>
            </div>
        )
    }

    return (
        <div className="active-filters">
            {(!isEmptyObject(searchValue) || !isEmptyObject(savedFilters)) &&
                Object.entries(
                    Object.assign({}, searchValue, savedFilters)
                ).sort() && (
                    <>
                        {Object.entries(
                            Object.assign({}, searchValue, savedFilters)
                        )
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
        </div>
    )
}
