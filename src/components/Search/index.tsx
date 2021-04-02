import _ from "the-lodash"
import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"

import "./styles.scss"
import { IDiagramService } from "@kubevious/ui-middleware"
import {
  SearchValue,
  SearchProps,
  SearchData,
  FilterValue, 
} from "./types"
import { SearchInput } from "./SearchInput"
import { SearchFilters } from "./SearchFilters"
import { SearchResults } from "./SearchResults"
import { sharedState } from "../../configureService"
import { SearchFilterList } from "./SearchFilterList"

import { FILTERS_LIST } from "./search-metadata"

const initialSearchData : SearchData = {
  components: _.makeDict(FILTERS_LIST, x => x.payload, x => ({
    searchId: x.searchId,
    filters: {}
  }))
}


interface TSearchState
{
  searchData: SearchData,
  activeFilters : FilterValue[],
  currentInput: any,
  autocomplete: any,
}

const initialState : TSearchState= {

  searchData: initialSearchData,
  activeFilters : [],

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


export class Search extends ClassComponent<SearchProps, TSearchState, IDiagramService> {
  fetchSearchResults(criteria: SearchValue) {
      this.fetchResults(criteria)
  }
  fetchAutocomplete(type: string, criteria: string): void {
    this.fetchKeys(type, criteria)
  }
  fetchAutocompleteValues(type: string, key: string, criteria: string): void {
    this.fetchValues(type, key, criteria)
  }
  

  constructor(props) {
    super(props, null, { kind: "diagram" })

    this.state = initialState
    this.fetchResults = this.fetchResults.bind(this)
    this.fetchKeys = this.fetchKeys.bind(this)
    this.fetchValues = this.fetchValues.bind(this)

    this.addFilter = this.addFilter.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.removeAllFilters = this.removeAllFilters.bind(this);
    this.getAllFilters = this.getAllFilters.bind(this);
  }

	fetchValues(type: string, key: string, criteria: string): void {
		if (!key) {
			return
		}
		this.service.fetchAutocompleteValues(
			type,
			{ key, criteria },
			(response) => {
        const autocomplete = sharedState.get('autocomplete') || {}
        autocomplete[type].values = response
        sharedState.set('autocomplete', autocomplete)
			}
		)
	}

	fetchKeys(type: string, criteria: string): void {
		return this.service.fetchAutocompleteKeys(
			type,
			{ criteria },
			(response) => {
          const autocomplete = sharedState.get('autocomplete') || {}
					autocomplete[type].keys = response
          sharedState.set('autocomplete', autocomplete)
			}
		)
	}

  fetchResults(criteria: SearchValue): void {
    this.service.fetchSearchResults(
      criteria,
      (response: any) => {
        if (response.results) {
          sharedState.set('was_filtered', response.wasFiltered)
          sharedState.set('search_result', response.result)
          sharedState.set('total_count', response.totalCount)
        } else {
          sharedState.set('search_result', response)
          sharedState.set('total_count', response.length)
        }
      }
    )
  }

  addFilter(searchId: string, filterId: string, caption: string, value: any)
  {
    const {
      searchData,
    } = this.state

    if (!searchData.components[searchId]) {
      searchData.components[searchId] = {
        searchId: searchId,
        filters: {}
      }
    }

    searchData.components[searchId].filters[filterId] = {
      searchId: searchId, 
      filterId: filterId, 
      caption: caption, 
      value: value, 
    }

    this._handleSearchDataChange();
  }

  removeFilter(searchId: string, filterId: string)
  {
    const {
      searchData,
    } = this.state

    if (searchData.components[searchId]) {
      delete searchData.components[searchId].filters[filterId];
    }

    this._handleSearchDataChange();
  }

  removeAllFilters(searchId: string)
  {
    const {
      searchData,
    } = this.state

    if (searchData.components[searchId]) {
      searchData.components[searchId].filters = {};
    }

    this._handleSearchDataChange();
  }

  getAllFilters(searchId: string) : FilterValue[]
  {
    const {
      searchData,
    } = this.state

    if (searchData.components[searchId]) {
      return _.values(searchData.components[searchId].filters);
    }

    return []
  }

  private _handleSearchDataChange()
  {
    const {
      searchData,
    } = this.state

    console.log("[_handleSearchDataChange] SearchData: ", searchData);

    let activeFilters : FilterValue[] = [];
    for(let componentData of _.values(searchData.components))
    {
      activeFilters = _.concat(activeFilters, _.values(componentData.filters));
    }

    this.setState({
      activeFilters: activeFilters,
      searchData: searchData
    })
  }


  render() {
    const {
      currentInput,
      autocomplete,
      activeFilters,
      searchData
    } = this.state
    return (
      <div className="Search-wrapper p-40 overflow-hide">
        <SearchInput />
        <SearchFilters activeFilters={activeFilters} />
        <div className="search-area">
          <SearchFilterList
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
