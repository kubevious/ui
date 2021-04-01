import _ from "the-lodash"
import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"

import "./styles.scss"
import { IDiagramService } from "@kubevious/ui-middleware"
import {
  SearchValue,
  SearchProps, 
} from "./types"
import { SearchInput } from "./SearchInput"
import { SearchFilters } from "./SearchFilters"
import { SearchResults } from "./SearchResults"
import { sharedState } from "../../configureService"
import { SearchFilterList } from "./SearchFilterList"

const initialState = {
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

export class Search extends ClassComponent<SearchProps, any, IDiagramService> {
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

  render() {
    const {
      currentInput,
      autocomplete,
    } = this.state
    return (
      <div className="Search-wrapper p-40 overflow-hide">
        <SearchInput />
        <SearchFilters />
        <div className="search-area">
          <SearchFilterList />
          <SearchResults />
        </div>
      </div>
    )
  }
}
