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
  SearchState,
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

export class Search extends ClassComponent<SearchProps, SearchState, IDiagramService> {
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

    this.state = {
      result: [],
      totalCount: 0,
      value: {},
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
      wasFiltered: false,
    }
    this.checkForInputFilter = this.checkForInputFilter.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  fetchResults(criteria: SearchValue): void {
    this.service.fetchSearchResults(
      criteria,
      (response: any) => {
        response.results ? this.setState({
          wasFiltered: response.wasFiltered,
          result: response.result,
          totalCount: response.totalCount
      }) : this.setState({
          result: response,
          totalCount: response.length,
        })
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

  checkForInputFilter(payload: string): boolean {
    return payload === "labels" || payload === "annotations"
  }

  handleFilterChange(
    name: string,
    title: string | { kind: string; count: number }
  ): void {
    this.setState(
      (prevState: SearchState) => {
        const valueInState = prevState.value || {}
        const savedFilters = prevState.savedFilters || {}
        if (prevState.value[name] === title) {
          delete valueInState[name]
          return {
            ...prevState,
            value: { ...valueInState },
          }
        }
        prevState.savedFilters[name] && delete savedFilters[name]
        return {
          ...prevState,
          value: { ...valueInState, [name]: title },
          savedFilters: { ...savedFilters },
        }
      },
      () => {
        this.fetchResults(this.state.value)
      }
    )
  }

  keyCheck(el: FilterType, key: string): boolean {
    return typeof el !== "string" && el.key === key
  }

  render() {
    const {
      result,
      totalCount,
      value,
      savedFilters,
      currentInput,
      wasFiltered,
      autocomplete,
    } = this.state

    const filtersList = this.isKinds ? [
      this.kinds,
      ...this.filterList
    ] : this.filterList
    return (
      <div className="Search-wrapper p-40 overflow-hide">
        <SearchInput
          criteria={value.criteria || ''}
          self={this}
        />
        <SearchFilters
          value={value}
          savedFilters={savedFilters}
          self={this}
          checkForInputFilter={this.checkForInputFilter}
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
                    checkForInputFilter={this.checkForInputFilter}
                    handleFilterChange={this.handleFilterChange}
                    autocomplete={autocomplete}
                    currentInput={currentInput}
                  />
                )
              })}
            {!isEmptyArray(this.markers.values) && this.isMarkers && (
              <SearchMarkers
                markers={this.markers}
                searchValue={value}
                self={this}
              />
            )}
          </div>
          <SearchResults result={result} wasFiltered={!!wasFiltered} totalCount={totalCount} />
        </div>
      </div>
    )
  }
}
