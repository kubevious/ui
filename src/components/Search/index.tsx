import _ from "the-lodash"
import React, { Fragment } from "react"
import Autocomplete from "react-autocomplete"
import { isEmptyArray } from "../../utils/util"
import { KIND_TO_USER_MAPPING } from "@kubevious/helpers/dist/docs"
import { MarkerPreview } from '@kubevious/ui-rule-engine'
import { ClassComponent } from "@kubevious/ui-framework"
import { FILTERS_LIST } from "../../boot/filterData"
import cx from "classnames"

import "./styles.scss"
import { IDiagramService } from "@kubevious/ui-middleware"
import {
  MarkersList,
  KindList,
  SearchState,
  SearchValue,
  KindListValue,
  FilterType,
} from "./types"
import { SelectedData, EditorItem } from "../../types"
import { SearchInput } from "./SearchInput"
import { SearchFilter } from "./SearchFilter"
import { SearchResults } from "./SearchResults"
import { SearchMarkers } from "./SearchMarkers"
import { SearchAutocomplete } from "./SearchAutocomplete"

export class Search extends ClassComponent<{}, SearchState, IDiagramService> {
  markers: MarkersList
  kinds: KindList
  constructor(props) {
    super(props, null, { kind: "diagram" })

    this.kinds = this.getKindsList()
    this.markers = this.getMarkersList()

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
    this.handleMarkerFilterChange = this.handleMarkerFilterChange.bind(this)
    this.deleteFilter = this.deleteFilter.bind(this)
    this.handleEditFilter = this.handleEditFilter.bind(this)
    this.toggleFilter = this.toggleFilter.bind(this)
    this.checkForInputFilter = this.checkForInputFilter.bind(this)
    this.handleFilterInput = this.handleFilterInput.bind(this)
    this.fetchKeys = this.fetchKeys.bind(this)
    this.fetchValues = this.fetchValues.bind(this)
    this.addInputField = this.addInputField.bind(this)
    this.clearFilter = this.clearFilter.bind(this)
  }

  fetchResults(criteria: SearchValue): void {
    this.service.fetchSearchResults(
      criteria,
      (response: SelectedData[]) => {
        this.setState({
          result: response,
          totalCount: response.length,
        })
      }
    )
  }

  fetchValues(type: string, key: string, criteria: string): void {
    if (!key) {
      return
    }
    this.service.fetchAutocompleteValues(
      type,
      { key, criteria },
      (response) => {
        this.setState((prevState: SearchState) => {
          prevState.autocomplete[type].values = response
          return {
            ...prevState,
            autocomplete: {
              ...prevState.autocomplete,
            },
          }
        })
      }
    )
  }

  fetchKeys(type: string, criteria: string): void {
    return this.service.fetchAutocompleteKeys(
      type,
      { criteria },
      (response) => {
        this.setState((prevState: SearchState) => {
          prevState.autocomplete[type].keys = response
          return {
            ...prevState,
            autocomplete: {
              ...prevState.autocomplete,
            },
          }
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
  //***
  //e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //***
  handleMarkerFilterChange(title: string): void {
    this.setState(
      (prevState: SearchState) => {
        const newMarker: EditorItem = _.filter(
          this.markers.values,
          (marker: EditorItem) => marker.name === title
        )[0]
        if (!newMarker.name) {
          return prevState
        }

        const valueInState = prevState.value
        const savedFilters = prevState.savedFilters
        const markerExists = _.filter(
          valueInState.markers,
          (marker: string) => marker === newMarker.name
        )
        const savedMarkers = _.filter(
          savedFilters.markers,
          (marker: string) => marker !== newMarker.name
        )

        if (!isEmptyArray(markerExists)) {
          const filteredMarkers = _.filter(
            valueInState.markers || savedFilters.markers,
            (marker: string) => marker !== newMarker.name
          )
          const value = { ...valueInState, markers: filteredMarkers }

          if (isEmptyArray(filteredMarkers)) {
            delete (value as any).markers
          }

          if (!isEmptyArray(savedMarkers)) {
            delete savedFilters.markers

            return {
              ...prevState,
              savedFilters,
              value,
            }
          }

          return {
            ...prevState,
            savedFilters,
            value,
          }
        }
        const changedMarkers = valueInState.markers ? [...valueInState.markers, newMarker.name] : [newMarker.name]

        if (!isEmptyArray(savedMarkers)) {
          return {
            ...prevState,
            savedFilters: { ...savedFilters, markers: savedMarkers },
            value: { ...valueInState, markers: savedMarkers },
          }
        }
        delete savedFilters.markers

        if (isEmptyArray(changedMarkers)) {
          delete valueInState.markers
          return {
            ...prevState,
            savedFilters,
            value: valueInState,
          }

        }

        return {
          ...prevState,
          savedFilters,
          value: { ...valueInState, markers: changedMarkers },
        }
      },
      () => {
        this.fetchResults(this.state.value)
      }
    )
  }

  handleFilterInput(value: string, name: string, title: FilterType): void {
    this.setState((prevState: SearchState) => {
      if (title === "key") {
        this.fetchKeys(name, value)
        prevState.currentInput[name].key = value
        return {
          ...prevState,
          currentInput: {
            ...prevState.currentInput,
          },
        }
      }
      const currentKey: string = prevState.currentInput[name].key
      this.fetchValues(name, currentKey, value)
      prevState.currentInput[name].value = value
      return {
        ...prevState,
        currentInput: {
          ...prevState.currentInput,
        },
      }
    })
  }

  addInputField(type: string): boolean {
    this.setState(
      (prevState: SearchState) => {
        const input = prevState.currentInput[type]
        if (!input.key) {
          return {
            ...prevState,
          }
        }
        const savedInState = prevState.savedFilters
        const currentInputInState = prevState.currentInput
        const searchValue: {
          key: string
          value: string
        }[] = prevState.value[type] || []
        const elementIndex = searchValue.findIndex((el) => el.key === input.key)
        elementIndex !== -1
          ? (searchValue[elementIndex] = input)
          : searchValue.push(input)
        const searchValueInSaved: {
          key: string
          value: string
        }[] = savedInState[type] || []
        const filteredSaved = searchValueInSaved.filter(
          (el) => el.key !== input.key
        )
        savedInState[type] = filteredSaved
        isEmptyArray(filteredSaved) && delete savedInState[type]
        currentInputInState[type] = { key: "", value: "" }
        return {
          value: {
            ...prevState.value,
            [type]: searchValue,
          },
          savedFilters: {
            ...savedInState,
          },
          currentInput: {
            ...currentInputInState,
          },
        }
      },
      () => {
        this.fetchResults(this.state.value)
      }
    )
    return false
  }

  deleteFilter(key: string, val: FilterType) {
    this.setState(
      (prevState: SearchState) => {
        const valueInState = prevState.value
        const savedInState = prevState.savedFilters
        const currentFilters = valueInState[key] || []
        const currentSavedFilters = savedInState[key] || []

        if (!this.checkForInputFilter(key)) {
          valueInState[key] && delete valueInState[key]
          savedInState[key] && delete savedInState[key]
          return {
            value: { ...valueInState },
            savedFilters: { ...savedInState },
          }
        }
        if (typeof val !== "string") {
          valueInState[key] = currentFilters.filter((filter: FilterType) =>
            !this.keyCheck(filter, val.key || "")
          )
          savedInState[key] = currentSavedFilters.filter((filter: FilterType) =>
            !this.keyCheck(filter, val.key || "")
          )
        }

        isEmptyArray(valueInState[key]) && delete valueInState[key]
        isEmptyArray(savedInState[key]) && delete savedInState[key]

        return {
          value: {
            ...valueInState,
          },
          savedFilters: {
            ...savedInState,
          },
        }
      },
      () => {
        this.fetchResults(this.state.value)
      }
    )
    return false
  }

  handleEditFilter(type: string, filterVal: FilterType): void {
    this.setState((prevState: SearchState) => {
      if (typeof filterVal === "string") {
        return {
          currentInput: {
            ...prevState.currentInput,
            [type]: {
              disabled: true,
            },
          },
        }
      }
      const { key, value } = filterVal

      return {
        currentInput: {
          ...prevState.currentInput,
          [type]: {
            key,
            value,
            disabled: true,
          },
        },
      }
    })
  }

  toggleFilter(type: string, filterVal: FilterType) {
    this.setState(
      (prevState: SearchState) => {
        const valueInState = prevState.value
        const savedInState = prevState.savedFilters
        if (!this.checkForInputFilter(type)) {
          const deleteFromSaved = () => {
            valueInState[type] = savedInState[type]
            delete savedInState[type]
          }

          const addToSaved = () => {
            savedInState[type] = valueInState[type]
            delete valueInState[type]
          }
          savedInState[type] ? deleteFromSaved() : addToSaved()
          return {
            ...prevState,
            value: { ...valueInState },
            savedFilters: { ...savedInState },
          }
        }

        let valueArray: FilterType[] = valueInState[type] || []
        let savedArray: FilterType[] = savedInState[type] || []
        let changedValueArray: FilterType[] = []
        let changedSavedArray: FilterType[] = []
        if (typeof filterVal !== "string") {
          changedValueArray = valueArray.filter((el) =>
            !this.keyCheck(el, filterVal.key || "")
          )
          changedSavedArray = savedArray.filter((el) =>
            !this.keyCheck(el, filterVal.key || "")
          )
        }
        if (savedInState[type]) {
          const compareLength = changedSavedArray.length === savedArray.length

          savedInState[type] = compareLength
            ? [...savedArray, filterVal]
            : changedSavedArray
          valueInState[type] = compareLength
            ? changedValueArray
            : [...valueArray, filterVal]

          if (isEmptyArray(valueInState[type])) {
            return prevState
          } else if (isEmptyArray(savedInState[type])) {
            delete savedInState[type]
            return prevState
          }

          return {
            ...prevState,
            value: {
              ...valueInState,
            },
            savedFilters: {
              ...savedInState,
            },
          }
        }

        valueInState[type] = changedValueArray
        isEmptyArray(changedValueArray) && delete valueInState[type]
        return {
          ...prevState,
          value: { ...valueInState },
          savedFilters: {
            ...savedInState,
            [type]: [filterVal],
          },
        }
      },
      () => {
        this.fetchResults(this.state.value)
      }
    )
  }

  clearFilter(type: string): void {
    this.setState(
      (prevState: SearchState) => {
        const { key }: { key: string } = prevState.currentInput[type]
        const valueInState = prevState.value
        const changedValueArray: FilterType[] =
          valueInState[type] &&
          valueInState[type].filter((el: FilterType) => this.keyCheck(el, key))
        isEmptyArray(changedValueArray)
          ? delete valueInState[type]
          : (valueInState[type] = changedValueArray)
        return {
          ...prevState,
          currentInput: {
            ...prevState.currentInput,
            [type]: {
              key: "",
              value: "",
            },
            value: {
              ...valueInState,
            },
          },
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
    return (
      <div className="Search-wrapper p-40 overflow-hide">
        <SearchInput
          criteria={value.criteria || ''}
          self={this}
        />
        <SearchFilter
          value={value}
          savedFilters={savedFilters}
          checkForInputFilter={this.checkForInputFilter}
          keyCheck={this.keyCheck}
          handleEditFilter={this.handleEditFilter}
          toggleFilter={this.toggleFilter}
          deleteFilter={this.deleteFilter}
        />
        <div className="search-area">
          <div className="filter-list filter-box">
            {[this.kinds, ...FILTERS_LIST] &&
              [this.kinds, ...FILTERS_LIST].map((el) => {
                return (
                  <details open key={el.payload}>
                    <summary
                      className={cx("filter-list inner", {
                        "is-active": !!value[el.payload],
                      })}
                    >
                      {el.shownValue}
                    </summary>
                    <div className="inner-items">zx
                      {this.checkForInputFilter(el.payload) ? (
                        <SearchAutocomplete
                          values={el.values}
                          payload={el.payload}
                          currentInput={currentInput}
                          autocomplete={autocomplete}
                          handleFilterInput={this.handleFilterInput}
                          fetchKeys={this.fetchKeys}
                          fetchValues={this.fetchValues}
                          addInputField={this.addInputField}
                          clearFilter={this.clearFilter}
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
                              this.handleFilterChange(el.payload, item.payload)
                            }
                          >
                            {item.title}
                          </button>
                        ))
                      )}
                    </div>
                  </details>
                )
              })}
            {!isEmptyArray(this.markers.values) && (
              <SearchMarkers
                markers={this.markers}
                searchValue={value}
                handleMarkerFilterChange={this.handleMarkerFilterChange}
              />
            )}
          </div>
          <SearchResults result={result} wasFiltered={!!wasFiltered} totalCount={totalCount} />
        </div>
      </div>
    )
  }
}
