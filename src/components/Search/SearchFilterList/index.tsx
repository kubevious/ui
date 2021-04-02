import _ from "lodash"

import React, { useEffect, useState } from "react"
import { FilterValue, KindList, KindListValue, MarkersList, SearchData } from "../types"
import { SearchFilterExpander } from "../SearchFilterExpander"
import { sharedState } from "../../../configureService"
import { KIND_TO_USER_MAPPING } from "@kubevious/helpers/dist/docs"
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
    const [isKinds, setIsKinds] = useState<boolean>(false)

    const [kinds, setKinds] = useState<KindList>({
        payload: "",
        shownValue: "",
        values: [],
    })

    const getKindsList = (): KindList => {
        let kindsArray = Object.entries(KIND_TO_USER_MAPPING)
        let newKindsArray = kindsArray
            ? kindsArray.map(([key, value]) => ({ title: value, payload: key }))
            : []
        newKindsArray =
            _.orderBy(newKindsArray, (x: KindListValue) => x.title) || []

        return {
            payload: "kind",
            shownValue: "Kind",
            values: newKindsArray,
        }
    }

    useEffect(() => {
        const is_kinds = !!sharedState.get("is_kinds")
        setIsKinds(!!is_kinds)

        if (is_kinds) {
            setKinds(getKindsList())
        }
    }, [])

    // const filtersList = isKinds ? [kinds, ...FILTERS_LIST] : FILTERS_LIST

    return (
        <div className="filter-list filter-box">
            {FILTERS_LIST &&
                FILTERS_LIST.map((filter: FilterItem, index) => {

                    const filterSearchData = searchData.components[filter.searchId];

                    const onFilterAdd = (filterId: string, caption: string, value: any) => {
                        addFilter(filter.searchId, filterId, caption, value);
                    }

                    const onFilterRemove = (filterId: string) => {
                        removeFilter(filter.searchId, filterId);
                    }

                    const onFilterRemoveAll = () => {
                        removeAllFilters(filter.searchId);
                    }

                    const onFilterGet = () => {
                        return getAllFilters(filter.searchId);
                    }

                    return (
                        <SearchFilterExpander
                            key={index}
                            filter={filter}
                        >
                            <filter.component 
                                data={filterSearchData}
                                addFilter={onFilterAdd} 
                                removeFilter={onFilterRemove} 
                                removeAllFilters={onFilterRemoveAll}
                                getAllFilters={onFilterGet} 
                                />
                        </SearchFilterExpander>
                    )
                })}
        </div>
    )
}
