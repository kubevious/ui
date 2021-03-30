import React from "react"
import { isEmptyArray, isEmptyObject } from "../../../utils/util"
import { FilterObjectType, FilterType, SearchState, SearchValue } from "../types"
import cx from "classnames"
import { prettyKind } from "../../../utils/ui-utils"
import { Search } from "../"

export const SearchFilter = ({
    value,
    savedFilters,
    self,
    checkForInputFilter,
    keyCheck,
}: {
    value: SearchValue,
    savedFilters: SearchValue,
    self: Search
    checkForInputFilter: (payload: string) => boolean
    keyCheck: (el: FilterType, key: string) => boolean
}) => {
    const handleEditFilter = (type: string, filterVal: FilterType): void => {
        self.setState((prevState: SearchState) => {
            if (typeof filterVal === "string") {
                return {
                    currentInput: {
                        ...prevState.currentInput,
                        [type]: {
                            disabled: true,
                        },
                    },
                }
            }
            const { key, value } = filterVal

            return {
                currentInput: {
                    ...prevState.currentInput,
                    [type]: {
                        key,
                        value,
                        disabled: true,
                    },
                },
            }
        })
    }

    const toggleFilter = (type: string, filterVal: FilterType) => {
        self.setState(
            (prevState: SearchState) => {
                const valueInState = prevState.value
                const savedInState = prevState.savedFilters
                if (!self.checkForInputFilter(type)) {
                    const deleteFromSaved = () => {
                        valueInState[type] = savedInState[type]
                        delete savedInState[type]
                    }

                    const addToSaved = () => {
                        savedInState[type] = valueInState[type]
                        delete valueInState[type]
                    }
                    savedInState[type] ? deleteFromSaved() : addToSaved()
                    return {
                        ...prevState,
                        value: { ...valueInState },
                        savedFilters: { ...savedInState },
                    }
                }

                let valueArray: FilterType[] = valueInState[type] || []
                let savedArray: FilterType[] = savedInState[type] || []
                let changedValueArray: FilterType[] = []
                let changedSavedArray: FilterType[] = []
                if (typeof filterVal !== "string") {
                    changedValueArray = valueArray.filter((el) =>
                        !self.keyCheck(el, filterVal.key || "")
                    )
                    changedSavedArray = savedArray.filter((el) =>
                        !self.keyCheck(el, filterVal.key || "")
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
                        return prevState
                    } else if (isEmptyArray(savedInState[type])) {
                        delete savedInState[type]
                        return prevState
                    }

                    return {
                        ...prevState,
                        value: {
                            ...valueInState,
                        },
                        savedFilters: {
                            ...savedInState,
                        },
                    }
                }

                valueInState[type] = changedValueArray
                isEmptyArray(changedValueArray) && delete valueInState[type]
                return {
                    ...prevState,
                    value: { ...valueInState },
                    savedFilters: {
                        ...savedInState,
                        [type]: [filterVal],
                    },
                }
            },
            () => {
                self.fetchResults(self.state.value)
            }
        )
    }

    const deleteFilter = (key: string, val: FilterType) => {
        self.setState(
            (prevState: SearchState) => {
                const valueInState = prevState.value
                const savedInState = prevState.savedFilters
                const currentFilters = valueInState[key] || []
                const currentSavedFilters = savedInState[key] || []

                if (!self.checkForInputFilter(key)) {
                    valueInState[key] && delete valueInState[key]
                    savedInState[key] && delete savedInState[key]
                    return {
                        value: { ...valueInState },
                        savedFilters: { ...savedInState },
                    }
                }
                if (typeof val !== "string") {
                    valueInState[key] = currentFilters.filter((filter: FilterType) =>
                        !self.keyCheck(filter, val.key || "")
                    )
                    savedInState[key] = currentSavedFilters.filter((filter: FilterType) =>
                        !self.keyCheck(filter, val.key || "")
                    )
                }

                isEmptyArray(valueInState[key]) && delete valueInState[key]
                isEmptyArray(savedInState[key]) && delete savedInState[key]

                return {
                    value: {
                        ...valueInState,
                    },
                    savedFilters: {
                        ...savedInState,
                    },
                }
            },
            () => {
                self.fetchResults(self.state.value)
            }
        )
        return false
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