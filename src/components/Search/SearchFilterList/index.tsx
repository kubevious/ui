import _ from "lodash"

import React from "react"
import { FilterComponentData, SearchData } from "../types"
import { SearchFilterExpander } from "../SearchFilterExpander"
import { FilterItem } from "../types"

export interface SearchFilterListProps {
    filterList: FilterItem[]
    searchData: SearchData
    addFilter(
        searchId: string,
        filterId: string,
        caption: string,
        value: any
    ): void
    removeFilter(searchId: string, filterId: string): void
    removeAllFilters(searchId: string): void
}

export const SearchFilterList: React.FunctionComponent<SearchFilterListProps> = ({
    filterList,
    searchData,
    addFilter,
    removeFilter,
    removeAllFilters,
}) => {
    return (
        <div className="filter-list filter-box">
            {filterList &&
                filterList.map((filter: FilterItem, index) => {
                    const sourceFilterSearchData =
                        searchData.components[filter.searchId]
                    const filterSearchData: FilterComponentData = {
                        searchId: sourceFilterSearchData.searchId,
                        filters: {},
                    }
                    for (let filter of _.values(
                        sourceFilterSearchData.filters
                    )) {
                        if (filter.isEnabled) {
                            filterSearchData.filters[filter.filterId] = filter
                        }
                    }

                    const onFilterAdd = (
                        filterId: string,
                        caption: string,
                        value: any
                    ) => {
                        addFilter(filter.searchId, filterId, caption, value)
                    }

                    const onFilterRemove = (filterId: string) => {
                        removeFilter(filter.searchId, filterId)
                    }

                    const onFilterRemoveAll = (
                        e: React.MouseEvent<SVGSVGElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                        e.preventDefault()
                        removeAllFilters(filter.searchId)
                    }

                    return (
                        <SearchFilterExpander
                            key={index}
                            filter={filter}
                            removeAllFilters={onFilterRemoveAll}
                        >
                            <filter.component
                                data={filterSearchData}
                                addFilter={onFilterAdd}
                                removeFilter={onFilterRemove}
                                removeAllFilters={onFilterRemoveAll}
                            />
                        </SearchFilterExpander>
                    )
                })}
        </div>
    )
}
