import React from "react"
import { SearchFilterItemProps } from "../types"
import { SearchAutocomplete } from "../SearchAutocomplete"

export const SearchFilterItem: React.FunctionComponent<SearchFilterItemProps> = ({
    value,
    el,
    parent,
    checkForInputFilter,
    handleFilterChange,
    autocomplete,
    currentInput,
}) => {
    return (
            <div className="inner-items">
                {checkForInputFilter(el.payload) ? (
                    <SearchAutocomplete
                        values={el.values}
                        payload={el.payload}
                        currentInput={currentInput}
                        autocomplete={autocomplete}
                        self={parent}
                    />
                ) : (
                    el.values &&
                    el.values.map((item) => (
                        <button
                            key={item.title}
                            className={
                                value[el.payload] === item.payload
                                    ? "selected-filter"
                                    : ""
                            }
                            onClick={() =>
                                handleFilterChange(el.payload, item.payload)
                            }
                        >
                            {item.title}
                        </button>
                    ))
                )}
            </div>
    )
}
