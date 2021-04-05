import _ from "lodash"

import React from "react"
import { FilterComponentData, FilterValue, SearchData } from "../types"
import { SearchFilterExpander } from "../SearchFilterExpander"
import { FilterItem } from "../types"

import { FILTERS_LIST } from "../search-metadata"

export interface SearchFilterListProps
{
  searchData : SearchData
  addFilter(searchId: string, filterId: string, caption: string, value: any) : void
  removeFilter(searchId: string, filterId: string) : void
  removeAllFilters(searchId: string) : void
  getAllFilters(searchId: string) : FilterValue[]
}

export const SearchFilterList: React.FunctionComponent<SearchFilterListProps> = 
({ searchData, addFilter, removeFilter, removeAllFilters, getAllFilters }) => {
    return (
        <div className="filter-list filter-box">
            {FILTERS_LIST &&
                FILTERS_LIST.map((filter: FilterItem, index) => {

                    const sourceFilterSearchData = searchData.components[filter.searchId];
                    const filterSearchData : FilterComponentData = {
                        searchId: sourceFilterSearchData.searchId,
                        filters: {}
                    }
                    for(let filter of _.values(sourceFilterSearchData.filters))
                    {
                        if (filter.isEnabled) {
                            filterSearchData.filters[filter.filterId] = filter;
                        }
                    }

                    const onFilterAdd = (filterId: string, caption: string, value: any) => {
                        addFilter(filter.searchId, filterId, caption, value);
                    }

                    const onFilterRemove = (filterId: string) => {
                        removeFilter(filter.searchId, filterId);
                    }

                    const onFilterRemoveAll = (e) => {
                        e.preventDefault()
                        removeAllFilters(filter.searchId);
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
