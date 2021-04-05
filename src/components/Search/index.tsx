import _ from "the-lodash"
import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"

import "./styles.scss"
import { IDiagramService } from "@kubevious/ui-middleware"
import { SearchProps, SearchData, FilterValue, FilterItem } from "./types"
import { SearchInput } from "./SearchInput"
import { SearchFilters } from "./SearchFilters"
import { SearchResults } from "./SearchResults"
import { sharedState } from "../../configureService"
import { SearchFilterList } from "./SearchFilterList"

interface TSearchState {
    searchData: SearchData
    activeFilters: FilterValue[]
    currentInput: any
    autocomplete: any
}

export class Search extends ClassComponent<
    SearchProps,
    TSearchState,
    IDiagramService
> {
    fetchSearchResults() {
        const criteria = sharedState.get("search_input")
        const { searchData } = this.state
        let backendData = {}
        if (criteria) {
          backendData = { criteria }
        }

        for(let componentData of _.values(searchData.components))
        {
            const componentMetadata = this._metadataDict[componentData.searchId];

            for(let filterData of _.values(componentData.filters))
            {
                if (filterData.isEnabled)
                {
                    if (!backendData[componentMetadata.payload]) {
                        backendData[componentMetadata.payload] = {}
                    }

                    backendData[componentMetadata.payload][filterData.filterId] = filterData.value;
                }
            }
        }

        sharedState.set('actived_filters', Object.keys(backendData))
        console.log("[SEARCH QUERY DATA] ", JSON.stringify(backendData, null, 4));

        this.fetchResults(backendData)
    }

    fetchAutocompleteKeys(type: string, criteria: any, cb: (data: any) => any): void {
        this.service.fetchAutocompleteKeys(type, criteria, cb)
    }

    fetchAutocompleteValues(type: string, criteria: any, cb: (data: any) => any): void {
        this.service.fetchAutocompleteValues(type, criteria, cb)
    }

    private _metadataDict : Record<string, FilterItem>;
    private _filterList : FilterItem[];

    initialSearchData: SearchData;

    initialState: TSearchState;
    constructor(props) {
        super(props, null, { kind: "diagram" })

        this._metadataDict = _.makeDict(this.props.filterList, x => x.searchId, x => x);
        this._filterList = this.props.filterList
        this.initialSearchData = {
            components: _.makeDict(
                this._filterList,
                (x) => x.searchId,
                (x) => ({
                    searchId: x.searchId,
                    filters: {},
                })
            ),
        }
        this.initialState = {
            searchData: this.initialSearchData,
            activeFilters: [],
        
            currentInput: {
                labels: {
                    key: "",
                    value: "",
                },
                annotations: {
                    key: "",
                    value: "",
                },
            },
            autocomplete: {
                labels: {
                    keys: [],
                    values: [],
                },
                annotations: {
                    keys: [],
                    values: [],
                },
            },
        }

        this.state = this.initialState
        this.fetchResults = this.fetchResults.bind(this)
        this.fetchAutocompleteKeys = this.fetchAutocompleteKeys.bind(this)
        this.fetchAutocompleteValues = this.fetchAutocompleteValues.bind(this)

        this.addFilter = this.addFilter.bind(this)
        this.removeFilter = this.removeFilter.bind(this)
        this.removeAllFilters = this.removeAllFilters.bind(this)
        this.toogleVisibilityFilter = this.toogleVisibilityFilter.bind(this)
        this.getAllFilters = this.getAllFilters.bind(this)
    }

    fetchResults(criteria: any): void {
        this.service.fetchSearchResults(criteria, (response: any) => {
            if (response.results) {
                sharedState.set("was_filtered", response.wasFiltered)
                sharedState.set("search_result", response.results)
                sharedState.set("total_count", response.totalCount)
            } else {
                sharedState.set("search_result", response)
                sharedState.set("total_count", response.length)
            }
        })
    }

    addFilter(searchId: string, filterId: string, caption: string, value: any) {
        const { searchData } = this.state
        if (!searchData.components[searchId]) {
            searchData.components[searchId] = {
                searchId: searchId,
                filters: {},
            }
        }

        searchData.components[searchId].filters[filterId] = {
            searchId: searchId,
            filterId: filterId,
            caption: caption,
            value: value,
            isEnabled: true,
        }

        this._handleSearchDataChange()
    }

    removeFilter(searchId: string, filterId: string) {
        const { searchData } = this.state

        if (searchData.components[searchId]) {
            delete searchData.components[searchId].filters[filterId]
        }

        this._handleSearchDataChange()
    }

    removeAllFilters(searchId: string) {
        const { searchData } = this.state

        if (searchData.components[searchId]) {
            searchData.components[searchId].filters = {}
        }

        this._handleSearchDataChange()
    }

    getAllFilters(searchId: string): FilterValue[] {
        const { searchData } = this.state

        if (searchData.components[searchId]) {
            return _.values(searchData.components[searchId].filters)
        }

        return []
    }

    private _handleSearchDataChange() {
        const { searchData } = this.state

        console.log("[_handleSearchDataChange] SearchData: ", searchData)

        let activeFilters: FilterValue[] = []
        for (let componentData of _.values(searchData.components)) {
            activeFilters = _.concat(
                activeFilters,
                _.values(componentData.filters)
            )
        }

        this.setState({
            activeFilters: activeFilters,
            searchData: searchData,
        })

        this.fetchSearchResults()
    }

    toogleVisibilityFilter = (searchId: string, filterId: string) => {
        const { searchData } = this.state
        const { isEnabled } = searchData.components[searchId].filters[
            filterId
        ]
        searchData.components[searchId].filters[
            filterId
        ].isEnabled = !isEnabled

        this._handleSearchDataChange()

    }

    render() {
        const {
            activeFilters,
            searchData,
        } = this.state

        return (
            <div className="Search-wrapper p-40 overflow-hide">
                <SearchInput />
                <SearchFilters
                    filterList={this._filterList}
                    activeFilters={activeFilters}
                    removeFilter={this.removeFilter}
                    toogleVisibilityFilter={this.toogleVisibilityFilter}
                />
                <div className="search-area">
                    <SearchFilterList
                        filterList={this._filterList}
                        searchData={searchData}
                        addFilter={this.addFilter}
                        removeFilter={this.removeFilter}
                        removeAllFilters={this.removeAllFilters}
                        getAllFilters={this.getAllFilters}
                    />
                    <SearchResults />
                </div>
            </div>
        )
    }
}
