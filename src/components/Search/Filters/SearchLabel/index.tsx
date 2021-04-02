import React, { Fragment, useState, useEffect, FC } from "react"
import Autocomplete from "react-autocomplete"
import { CurrentInput, FilterType } from "../../types"
import { isEmptyArray } from "../../../../utils/util"
import {
    fetchAutocomplete,
    fetchAutocompleteValues,
    fetchSearchResult,
    keyCheck,
} from "../../util"
import { sharedState } from "../../../../configureService"

import "../../styles.scss"
import { FilterComponentProps } from "../../types"

const initialCurrentInput = {
    labels: {
        key: "",
        value: "",
    },
    annotations: {
        key: "",
        value: "",
    },
}
const initialAutocomplete = {
    labels: {
        keys: [],
        values: [],
    },
    annotations: {
        keys: [],
        values: [],
    },
}

export const SearchLabel : FC<FilterComponentProps>  = ({ data, addFilter, removeFilter, removeAllFilters }) => {
    const [currentInput, setCurrentInput] = useState<CurrentInput>(
        initialCurrentInput
    )
    const [autocomplete, setAutocomplete] = useState<Autocomplete>(
        initialAutocomplete
    )

    useEffect(() => {
        sharedState.set("autocomplete", initialAutocomplete)
    }, [])

    useEffect(() => {
        sharedState.set("current_input", initialCurrentInput)
    }, [])

    useEffect(() => {
        sharedState.subscribe("autocomplete", (autocomplete) => {
            setAutocomplete(autocomplete || initialAutocomplete)
        })
    }, [])

    useEffect(() => {
        sharedState.subscribe("current_input", (current_input) => {
            setCurrentInput(current_input || initialCurrentInput)
        })
    }, [])

    const handleFilterInput = (
        value: string,
        name: string,
        title: FilterType
    ): void => {
        const actualCurrentInput = sharedState.get("current_input")
        if (title === "key") {
            actualCurrentInput.labels = {
				...actualCurrentInput.labels,
				key: value
			}
            sharedState.set("current_input", {
				...actualCurrentInput.labels,
				key: value
			})
            fetchAutocomplete('labels', value)

            return
        }
        const currentKey: string = actualCurrentInput.key || actualCurrentInput.labels.key || ''

        sharedState.set("current_input", {
			...actualCurrentInput.labels,
			value
		})
        fetchAutocompleteValues('labels', currentKey, value)
    }

    const addInputField = (type: string): void => {
        const currentInputInState = sharedState.get("current_input")
        const savedFilters = sharedState.get("saved_filters") || {}
        const searchValues = sharedState.get("search_values") || {}
        const input = currentInputInState[type]
        if (!input.key) {
            return
        }
        const savedInState = savedFilters
        const searchValue: {
            key: string
            value: string
        }[] = searchValues[type] || []

        const elementIndex = searchValue.findIndex((el) => el.key === input.key)
        elementIndex !== -1
            ? (searchValue[elementIndex] = input)
            : searchValue.push(input)

        const searchValueInSaved: {
            key: string
            value: string
        }[] = savedInState[type] || []

        const filteredSaved = searchValueInSaved.filter(
            (el) => el.key !== input.key
        )

        savedInState[type] = filteredSaved
        isEmptyArray(filteredSaved) && delete savedInState[type]
        currentInputInState[type] = { key: "", value: "" }
        sharedState.set("current_input", currentInputInState)
        sharedState.set("saved_filters", savedInState)
        sharedState.set("search_values", {
            ...searchValues,
            [type]: searchValue,
        })
    }

    const clearFilter = (type: string): void => {
        const currentInputInState = sharedState.get("current_input") || {}
        const searchValues = sharedState.get("search_values") || {}
        const { key }: { key: string } = currentInputInState[type]
        const valueInState = searchValues
        const changedValueArray: FilterType[] =
            valueInState[type] &&
            valueInState[type].filter((el: FilterType) => keyCheck(el, key))
        isEmptyArray(changedValueArray)
            ? delete valueInState[type]
            : (valueInState[type] = changedValueArray)

        sharedState.set("current_input", currentInputInState)
        sharedState.set("search_values", {
            ...currentInputInState,
            [type]: {
                key: "",
                value: "",
            },
            value: {
                ...valueInState,
            },
        })
    }

    const handleAddInput = (type: string) => {
        addInputField(type)
        fetchSearchResult()
    }

    const handleClearFilter = (type: string) => {
        clearFilter(type)
        fetchSearchResult()
    }

    const values = [
        {
            title: "Label",
            payload: "key",
        },
        {
            title: "Value",
            payload: "value",
        },
    ]

    return (
        <div className="filter-input-box">
            <div>
                {
                    JSON.stringify(data, null, 4)
                }
            </div>
            
            {values.map((item, index) => {
                console.log(
                    'autocomplete["labels"] :>> ',
					currentInput
                )
                return (
                    <Fragment key={item.title}>
                        <label>{item.title}</label>
                        <Autocomplete
                            getItemValue={(value) => value}
                            items={autocomplete["labels"].keys}
                            value={currentInput[item.payload]}
                            onChange={(e) =>
                                handleFilterInput(
                                    e.target.value,
                                    "labels",
                                    item.payload
                                )
                            }
                            onSelect={(val) =>
                                handleFilterInput(val, "labels", item.payload)
                            }
                            renderItem={(content) => <div>{content}</div>}
                            renderMenu={(items) => (
                                <div
                                    className="autocomplete"
                                    children={items}
                                />
                            )}
                            // renderInput={(props) => (
                            //     <input
                            //         disabled={currentInput["labels"].disabled}
                            //         {...props}
                            //     />
                            // )}
                            onMenuVisibilityChange={() =>
                                fetchAutocomplete(
                                    "labels",
                                    currentInput[item.payload]
                                )
                            }
                        />
                    </Fragment>
                )
            })}
            {currentInput['key'] && currentInput['value'] && (
                <div className="filter-input-btns">
                    <button
                        type="button"
                        className="add-filter-btn"
                        onClick={() => handleAddInput("labels")}
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClearFilter("labels")}
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    )
}
