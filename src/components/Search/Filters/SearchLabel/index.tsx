import React, { Fragment, useState, useEffect, FC } from "react"
import Autocomplete from "react-autocomplete"
import { FilterType } from "../../types"
import {
    fetchAutocomplete,
    fetchAutocompleteValues,
} from "../../util"
import { sharedState } from "../../../../configureService"

import "../../styles.scss"
import { FilterComponentProps } from "../../types"

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

export const SearchLabel: FC<FilterComponentProps> = ({
    data,
    addFilter,
    removeFilter,
    removeAllFilters
}) => {
    const [currentValue, setCurrentValue] = useState<string>("")
    const [currentKey, setCurrentKey] = useState<string>("")
    const [editedLabels, setEditedLabels] = useState<{filter?: string, value?: string}>({})

    const [autocomplete, setAutocomplete] = useState<Autocomplete>(
        initialAutocomplete
    )

    useEffect(() => {
        sharedState.set("autocomplete", initialAutocomplete)
    }, [])

    useEffect(() => {
        sharedState.subscribe("edited_filter_labels", (edited_filter_labels) => {
            if (edited_filter_labels) {
                setEditedLabels(edited_filter_labels || {})
                setCurrentValue(edited_filter_labels.value)
                setCurrentKey(edited_filter_labels.filter)
            }
        })
    }, [])

    useEffect(() => {
        sharedState.subscribe("autocomplete", (autocomplete) => {
            setAutocomplete(autocomplete || initialAutocomplete)
        })
    }, [])

    const handleFilterInput = (value: string, title: FilterType): void => {
        if (title === "key") {
            setCurrentKey(value)
            fetchAutocomplete("labels", value)

            return
        }
        setCurrentValue(value)
        fetchAutocompleteValues("labels", currentKey, value)
    }

    const addInputField = (key?: string): void => {
        addFilter(key || currentKey, `${key || currentKey}: ${currentValue}`, currentValue);
        setCurrentValue('')
        setCurrentKey('')
        setEditedLabels({})
        sharedState.set("edited_filter_labels", null)
    }

    const handleClearFilter = (key?: string) => {
        removeFilter(key ||currentKey)
        setCurrentValue('')
        setCurrentKey('')
        setEditedLabels({})
        sharedState.set("edited_filter_labels", null)
    }
    return (
        <div className="filter-input-box">
            <Fragment key="Label">
                <label>Label</label>
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocomplete.labels.keys}
                    value={currentKey}
                    onChange={(e) => handleFilterInput(e.target.value, "key")}
                    onSelect={(val) => handleFilterInput(val, "key")}
                    renderItem={(content) => <div>{content}</div>}
                    renderMenu={(items) => (
                        <div className="autocomplete" children={items} />
                    )}
                    renderInput={(props) => (
                        <input
                            disabled={!!editedLabels.filter}
                            {...props}
                        />
                    )}
                    onMenuVisibilityChange={() =>
                        fetchAutocomplete("labels", currentKey)
                    }
                />
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocomplete.labels.values}
                    value={currentValue}
                    onChange={(e) => handleFilterInput(e.target.value, "value")}
                    onSelect={(val) => handleFilterInput(val, "value")}
                    renderItem={(content) => <div>{content}</div>}
                    renderMenu={(items) => (
                        <div className="autocomplete" children={items} />
                    )}
                    renderInput={(props) => (
                        <input
                            disabled={!currentKey.trim()}
                            {...props}
                        />
                    )}
                    onMenuVisibilityChange={() =>
                        fetchAutocomplete("labels", currentValue)
                    }
                />
            </Fragment>
            {currentKey.trim() && currentValue.trim() && (
                <div className="filter-input-btns">
                    <button
                        type="button"
                        className="add-filter-btn"
                        onClick={() => addInputField(editedLabels.filter)}
                    >
                        {!!editedLabels.filter ? 'Update' : 'Add'}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClearFilter(editedLabels.filter)}
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    )
}
