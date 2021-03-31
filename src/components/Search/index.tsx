import _ from "the-lodash"
import React from "react"
import { isEmptyArray } from "../../utils/util"
import { KIND_TO_USER_MAPPING } from "@kubevious/helpers/dist/docs"
import { ClassComponent } from "@kubevious/ui-framework"

import "./styles.scss"
import { IDiagramService } from "@kubevious/ui-middleware"
import {
  MarkersList,
  KindList,
  SearchValue,
  KindListValue,
  FilterType,
  FiltersList,
  SearchProps, 
} from "./types"
import { EditorItem } from "../../types"
import { SearchInput } from "./SearchInput"
import { SearchFilters } from "./SearchFilters"
import { SearchResults } from "./SearchResults"
import { SearchMarkers } from "./SearchMarkers"
import { SearchFilterExpander } from "./SearchFilterExpander"
import { sharedState } from "../../configureService"

const initialState = {
  savedFilters: {},
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
  markers: MarkersList
  kinds: KindList
  isKinds: boolean
  isMarkers: boolean
  filterList: FiltersList[]
  constructor(props) {
    super(props, null, { kind: "diagram" })

    this.kinds = this.getKindsList()
    this.markers = this.getMarkersList()

    this.isKinds = props.isKinds
    this.isMarkers = props.isMarkers
    this.filterList = props.filterList || []
    this.state = initialState
    this.fetchResults = this.fetchResults.bind(this)
  }

  fetchResults(criteria: SearchValue): void {
    this.service.fetchSearchResults(
      criteria,
      (response: any) => {
        if (response.results) {
          sharedState.set('wasFiltered', response.wasFiltered)
          sharedState.set('search_result', response.result)
          sharedState.set('totalCount', response.totalCount)
        } else {
          sharedState.set('search_result', response)
          sharedState.set('totalCount', response.length)
        }
      }
    )
  }

  getKindsList(): KindList {
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

  getMarkersList(): MarkersList {
    const markers: EditorItem[] = this.sharedState.get("marker_editor_items")

    return {
      payload: "markers",
      shownValue: "Markers",
      values: markers,
    }
  }


  keyCheck(el: FilterType, key: string): boolean {
    return typeof el !== "string" && el.key === key
  }

  render() {
    const {
      savedFilters,
      currentInput,
      autocomplete,
    } = this.state
    const value = sharedState.get('search_value') || {}

    const filtersList = this.isKinds ? [
      this.kinds,
      ...this.filterList
    ] : this.filterList
    return (
      <div className="Search-wrapper p-40 overflow-hide">
        <SearchInput />
        <SearchFilters
          value={value}
          savedFilters={savedFilters}
          self={this}
          keyCheck={this.keyCheck}
        />
        <div className="search-area">
          <div className="filter-list filter-box">
            {filtersList &&
              filtersList.map((el) => {
                return (
                  <SearchFilterExpander
                    value={value}
                    el={el}
                    parent={this}
                    autocomplete={autocomplete}
                    currentInput={currentInput}
                  />
                )
              })}
            {!isEmptyArray(this.markers.values) && this.isMarkers && (
              <SearchMarkers
                self={this}
              />
            )}
          </div>
          <SearchResults />
        </div>
      </div>
    )
  }
}
