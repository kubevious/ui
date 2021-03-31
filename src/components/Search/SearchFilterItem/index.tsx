import React from "react"
import { SearchFilterItemProps } from "../types"
import { SearchAutocomplete } from "../SearchAutocomplete"
import { sharedState } from "../../../configureService"
import { checkForInputFilter } from "../util"

export const SearchFilterItem: React.FunctionComponent<SearchFilterItemProps> = ({
    value,
    el,
    parent,
    autocomplete,
    currentInput,
}) => {
    const handleFilterChange = (
      name: string,
      title: string | { kind: string; count: number }
    ): void => {
      const valueInState = sharedState.get('search_value') || {}
      const savedFilters = sharedState.get('savedFilters') || {}
      if (valueInState[name] === title) {
        delete valueInState[name]
        sharedState.set('search_value', { ...valueInState })
      }
      savedFilters[name] && delete savedFilters[name]
      sharedState.set('savedFilters', { ...savedFilters })
      sharedState.set('search_value', { ...valueInState, [name]: title })
    }
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
