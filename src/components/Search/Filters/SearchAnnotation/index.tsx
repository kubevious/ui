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

export const SearchAnnotation: FC<FilterComponentProps> = ({
    data,
    addFilter,
    removeFilter,
    removeAllFilters
}) => {
    const [currentValue, setCurrentValue] = useState<string>("")
    const [currentKey, setCurrentKey] = useState<string>("")
    const [editedAnnotations, setEditedAnnotations] = useState<{filter?: string, value?: string}>({})

    const [autocomplete, setAutocomplete] = useState<Autocomplete>(
        initialAutocomplete
    )

    useEffect(() => {
        sharedState.set("autocomplete", initialAutocomplete)
    }, [])

    useEffect(() => {
        sharedState.subscribe("edited_filter_annotations", (edited_filter_annotations) => {
            if (edited_filter_annotations) {
                setEditedAnnotations(edited_filter_annotations || {})
                setCurrentValue(edited_filter_annotations.value)
                setCurrentKey(edited_filter_annotations.filter)
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
            fetchAutocomplete("annotations", value)

            return
        }
        setCurrentValue(value)
        fetchAutocompleteValues("annotations", currentKey, value)
    }

    const addInputField = (key?: string): void => {
        addFilter(key || currentKey, `${key || currentKey} ${currentValue}`, currentValue);
        setCurrentValue('')
        setCurrentKey('')
        setEditedAnnotations({})
        sharedState.set("edited_filter_annotations", null)
    }

    const handleClearFilter = (key?: string) => {
        removeFilter(key ||currentKey)
        setCurrentValue('')
        setCurrentKey('')
        setEditedAnnotations({})
        sharedState.set("edited_filter_annotations", null)
    }

    return (
        <div className="filter-input-box">
            <Fragment key="Annotation">
                <label>Annotation</label>
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocomplete.annotations.keys}
                    value={currentKey}
                    onChange={(e) => handleFilterInput(e.target.value, "key")}
                    onSelect={(val) => handleFilterInput(val, "key")}
                    renderItem={(content) => <div>{content}</div>}
                    renderMenu={(items) => (
                        <div className="autocomplete" children={items} />
                    )}
                    renderInput={(props) => (
                        <input
                            disabled={!!editedAnnotations.filter}
                            {...props}
                        />
                    )}
                    onMenuVisibilityChange={() =>
                        fetchAutocomplete("annotations", currentKey)
                    }
                />
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocomplete.annotations.values}
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
                        fetchAutocomplete("annotations", currentValue)
                    }
                />
            </Fragment>
            {currentKey.trim() && currentValue.trim() && (
                <div className="filter-input-btns">
                    <button
                        type="button"
                        className="add-filter-btn"
                        onClick={() => addInputField(editedAnnotations.filter)}
                    >
                        {!!editedAnnotations.filter ? 'Update' : 'Add'}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClearFilter(editedAnnotations.filter)}
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    )
}
