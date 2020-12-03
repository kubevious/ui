import React, { Fragment } from 'react'
import TextInput from 'react-autocomplete-input'
import { isEmptyArray, isEmptyObject, insertToArray } from '../../utils/util'
import DocUtils from 'kubevious-helpers/lib/docs'
import { prettyKind } from '../../utils/ui-utils'
import DnShortcutComponent from '../DnShortcutComponent'
import BaseComponent from '../../HOC/BaseComponent'
import MarkerPreview from '../MarkerPreview'
import { ANNOTATIONS, FILTERS_LIST, LABELS } from '../../boot/filterData'
import cx from 'classnames'

import './styles.scss'

class Search extends BaseComponent {
    constructor(props) {
        super(props)

        this.registerService({ kind: 'diagram' })

        this.kinds = this.getKindsList()
        this.markers = this.getMarkersList()

        this.state = {
            result: [],
            value: {},
            counters: {
                labels: { [+new Date()]: '' },
                annotations: { [+new Date()]: '' },
            },
            savedFilters: {},
            currentIndexes: {
                labels: 0,
                annotations: 0,
            },
        }
    }


    fetchResults(criteria) {
        this.service.fetchSearchResults(criteria, (result) => {
            this.setState({ result: result })
        })
    }

    getKindsList() {
        const kindsArray = Object.entries(
            DocUtils.KIND_TO_USER_MAPPING
        ).map(([key, value]) => ({ title: value, payload: key }))

        return {
            payload: 'kind',
            shownValue: 'Kind',
            values: kindsArray,
        }
    }

    getMarkersList() {
        const markers = this.sharedState.get('marker_editor_items')

        return {
            payload: 'markers',
            shownValue: 'Markers',
            values: markers,
        }
    }

    checkForInputFilter(payload) {
        return payload === 'labels' || payload === 'annotations'
    }

    handleChange(e) {
        const input = e.target.value
        this.setState(
            (prevState) => {
                if (isEmptyArray(input)) {
                    delete prevState.value.criteria
                    return {
                        value: { ...prevState.value },
                    }
                }
                return {
                    value: { ...prevState.value, criteria: input },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    handleFilterChange(e) {
        const { name, title } = e.target
        this.setState(
            (prevState) => {
                if (prevState.value[name] === title) {
                    delete prevState.value[name]
                    return {
                        value: { ...prevState.value },
                    }
                }
                prevState.savedFilters[name] &&
                    delete prevState.savedFilters[name]
                return {
                    value: { ...prevState.value, [name]: title },
                    savedFilters: { ...prevState.savedFilters },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    handleMarkerFilterChange(e) {
        const { title } = e.target
        this.setState(
            (prevState) => {
                const markersList = prevState.value.markers || []
                if (
                    prevState.value.markers &&
                    markersList.find((marker) => marker === title)
                ) {
                    const changedMarkers = markersList.filter(
                        (marker) => marker !== title
                    )
                    if (isEmptyArray(changedMarkers)) {
                        delete prevState.value.markers
                        return { value: { ...prevState.value } }
                    }
                    return {
                        value: { ...prevState.value, markers: changedMarkers },
                    }
                }

                markersList.push(title)
                return {
                    value: { ...prevState.value, markers: markersList },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    handleFilterInput(value, name, title, index) {
        this.setState(
            (prevState) => {
                const { [name]: prevFilter = [] } = prevState.value
                const currentCounters = prevState.counters[name]
                const currentIndex = prevState.currentIndexes[name]
                const [selectedKey] = prevFilter[currentIndex]
                    ? Object.keys(prevFilter[currentIndex])
                    : ['']
                const currentCounterValue = Object.keys(currentCounters).find(
                    (key) => currentCounters[key] === selectedKey
                )
                const foundVal =
                    !isEmptyArray(prevFilter) && prevFilter[currentIndex]
                const { [selectedKey]: prevFilterVal } = foundVal
                    ? foundVal
                    : { [selectedKey]: '' }

                if (title === 'key') {
                    prevFilter[currentIndex]
                        ? (prevFilter[currentIndex] = {
                              [value]: prevFilterVal,
                          })
                        : prevFilter.push({ [value]: prevFilterVal })

                    return {
                        value: {
                            ...prevState.value,
                            [name]: prevFilter,
                        },
                        counters: {
                            ...prevState.counters,
                            [name]: {
                                ...prevState.counters[name],
                                [currentCounterValue]: value,
                            },
                        },
                    }
                }
                let wasValueChanged = false
                const changedFilters = prevFilter.map((el) => {
                    const [currentKey] = Object.keys(el)
                    if (currentKey === selectedKey) {
                        el[currentKey] = value
                        wasValueChanged = true
                    }
                    return el
                })
                !wasValueChanged && changedFilters.push({ '': value })
                return {
                    value: {
                        ...prevState.value,
                        [name]: changedFilters,
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    addInputField(type) {
        this.setState((prevState) => {
            const prevCounters = prevState.counters
            const prevIndexes = prevState.currentIndexes
            const current = prevCounters[type]
            return {
                counters: {
                    ...prevCounters,
                    [type]: { ...current, [+new Date()]: '' },
                },
                currentIndexes: { ...prevIndexes, [type]: ++prevIndexes[type] },
            }
        })
        return false
    }

    deleteFilter(key, counter) {
        this.setState(
            (prevState) => {
                const currentFilters = prevState.value[key] || []
                const currentSavedFilters = prevState.savedFilters[key] || []
                const sumOfFilters = currentFilters.concat(currentSavedFilters)
                const currentCounters = prevState.counters[key] || {}
                const deletedCounter = currentCounters[counter]

                prevState.value[key] && delete prevState.value[key]
                prevState.savedFilters[key] &&
                    delete prevState.savedFilters[key]
                prevState.counters[key] &&
                    delete prevState.counters[key][counter]
                if (
                    typeof currentFilters === 'string' ||
                    typeof currentSavedFilters === 'string'
                ) {
                    return {
                        value: { ...prevState.value },
                        savedFilters: { ...prevState.savedFilters },
                    }
                } else if (sumOfFilters.length === 1) {
                    return {
                        value: { ...prevState.value },
                        counters: {
                            ...prevState.counters,
                            [key]: { [+new Date()]: '' },
                        },
                        savedFilters: { ...prevState.savedFilters },
                    }
                }
                return {
                    value: {
                        ...prevState.value,
                        [key]: currentFilters.filter(
                            (filter) => !filter[deletedCounter]
                        ),
                    },
                    counters: { ...prevState.counters, [key]: currentCounters },
                    currentIndexes: {
                        ...prevState.currentIndexes,
                        [key]: Math.max(--prevState.currentIndexes[key], 0),
                    },
                    savedFilters: {
                        ...prevState.savedFilters,
                        [key]: currentSavedFilters.filter(
                            (filter) => !filter[deletedCounter]
                        ),
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
        return false
    }

    handleEditFilter(key, val) {
        this.setState((prevState) => {
            const index = prevState.value[key].findIndex((elem) => {
                const [valueKey] = Object.keys(elem)
                const [currentKey] = Object.keys(val[0])
                return valueKey === currentKey
            })
            return {
                currentIndexes: { ...prevState.currentIndexes, [key]: index },
            }
        })
    }

    toggleFilter(key, counter) {
        this.setState(
            (prevState) => {
                if (!counter) {
                    const deleteFromSaved = () => {
                        prevState.value[key] = prevState.savedFilters[key]
                        delete prevState.savedFilters[key]
                    }

                    const addToSaved = () => {
                        prevState.savedFilters[key] = prevState.value[key]
                        delete prevState.value[key]
                    }
                    prevState.savedFilters[key]
                        ? deleteFromSaved()
                        : addToSaved()
                    return {
                        value: { ...prevState.value },
                        savedFilters: { ...prevState.savedFilters },
                    }
                }
                let valueArray = prevState.value[key] || []
                let savedArray = prevState.savedFilters[key] || []
                const currentIndex = prevState.currentIndexes[key]
                const currentKey = prevState.counters[key][counter]
                const currentValue =
                    valueArray
                        .concat(savedArray)
                        .find((el) => el[currentKey]) || {}
                let changedValueArray = valueArray.filter(
                    (el) => !el[currentKey]
                )
                let changedSavedArray = savedArray.filter(
                    (el) => !el[currentKey]
                )

                if (prevState.savedFilters[key]) {
                    const compareLength =
                        changedSavedArray.length === savedArray.length

                    savedArray = compareLength
                        ? insertToArray(savedArray, currentIndex, currentValue)
                        : changedSavedArray
                    valueArray = compareLength
                        ? changedValueArray
                        : insertToArray(valueArray, currentIndex, currentValue)
                    if (isEmptyArray(valueArray)) {
                        delete prevState.value[key]
                        return {
                            value: {
                                ...prevState.value,
                            },
                            savedFilters: {
                                ...prevState.savedFilters,
                                [key]: savedArray,
                            },
                            currentIndexes: {
                                ...prevState.currentIndexes,
                                [key]: currentIndex,
                            },
                        }
                    } else if (isEmptyArray(savedArray)) {
                        delete prevState.savedFilters[key]
                        return {
                            value: {
                                ...prevState.value,
                                [key]: valueArray,
                            },
                            savedFilters: { ...prevState.savedFilters },
                            currentIndexes: {
                                ...prevState.currentIndexes,
                                [key]: ++prevState.currentIndexes[key],
                            },
                        }
                    }
                    return {
                        value: {
                            ...prevState.value,
                            [key]: valueArray,
                        },
                        savedFilters: {
                            ...prevState.savedFilters,
                            [key]: savedArray,
                        },
                        currentIndexes: {
                            ...prevState.currentIndexes,
                            [key]: compareLength
                                ? ++prevState.currentIndexes[key]
                                : Math.max(--prevState.currentIndexes[key], 0),
                        },
                    }
                }
                return {
                    value: { ...prevState.value, [key]: changedValueArray },
                    savedFilters: {
                        ...prevState.savedFilters,
                        [key]: [currentValue],
                    },
                    currentIndexes: {
                        ...prevState.currentIndexes,
                        [key]: Math.max(--prevState.currentIndexes[key], 0),
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    renderPrettyView(val = []) {
        return val.map((el, index) => {
            if (typeof el === 'object') {
                const [[key, value]] = Object.entries(el)
                const stringified = [key, value].join(' ')
                this.renderActiveFilters(key, stringified)
                return `${key}: ${value}`
            }
            return index === val.length - 1 ? el : `${el} | `
        })
    }

    renderActiveFilters(key, val, counter) {
        const { savedFilters } = this.state
        const checkInSavedFilters =
            savedFilters[key] && savedFilters[key].length
                ? savedFilters[key].find((el) => el === val[0])
                : savedFilters[key]
        if (!val) return
        return (
            <div
                className={cx('active-filter-box', {
                    deactivated: checkInSavedFilters,
                })}
                key={key}
            >
                <span className="filter-key">{`${key}: `}</span>
                <span className="filter-val">
                    {typeof val === 'string'
                        ? prettyKind(val)
                        : this.renderPrettyView(val)}
                </span>
                {this.checkForInputFilter(key) && !checkInSavedFilters && (
                    <button
                        className="filter-btn edit"
                        onClick={() => this.handleEditFilter(key, val)}
                    ></button>
                )}
                <button
                    className={cx('filter-btn toggle-show', {
                        hide: checkInSavedFilters,
                    })}
                    title="Toggle show/hide"
                    onClick={() => this.toggleFilter(key, counter)}
                />
                <button
                    className="filter-btn del"
                    title="Delete"
                    onClick={() => this.deleteFilter(key, counter)}
                >
                    &times;
                </button>
            </div>
        )
    }

    renderDividedActiveFilters(counter, key, val) {
        if (!val) {
            return
        }
        const saved = this.state.savedFilters[key] || {}
        const sumOfValues = this.state.value[key]
            ? this.state.value[key].concat(saved)
            : saved

        const loopCounter = Object.entries(counter)
        return loopCounter.map(([count, el]) => {
            return sumOfValues.map((filter) => {
                if (filter[el]) {
                    return this.renderActiveFilters(key, [filter], count)
                }
                return
            })
        })
    }

    render() {
        const {
            result,
            value,
            counters,
            savedFilters,
            currentIndexes,
        } = this.state

        return (
            <div className="Search-wrapper p-40 overflow-hide">
                <div className="form-group has-success">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search"
                        value={value.criteria}
                        autoFocus
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
                {(!isEmptyObject(value) || !isEmptyObject(savedFilters)) && (
                    <div className="active-filters">
                        {Object.entries(
                            Object.assign({}, value, savedFilters)
                        ).map(
                            ([key, val]) =>
                                key !== 'criteria' &&
                                (this.checkForInputFilter(key)
                                    ? this.renderDividedActiveFilters(
                                          counters[key],
                                          key,
                                          val
                                      )
                                    : this.renderActiveFilters(
                                          key,
                                          val,
                                          counters[key]
                                      ))
                        )}
                    </div>
                )}
                <div className="search-area">
                    <div className="filter-list filter-box">
                        {[this.kinds, ...FILTERS_LIST].map((el) => (
                            <details open key={el.payload}>
                                <summary
                                    className={cx('filter-list inner', {
                                        'is-active': !!value[el.payload],
                                    })}
                                >
                                    {el.shownValue}
                                </summary>
                                <div className="inner-items">
                                    {this.checkForInputFilter(el.payload)
                                        ? Object.keys(counters[el.payload]).map(
                                              (counter, index) => {
                                                  const elementIndex =
                                                      currentIndexes[el.payload]
                                                  const [
                                                      [curentKey, currentVal],
                                                  ] =
                                                      value[el.payload] &&
                                                      value[el.payload][
                                                          elementIndex
                                                      ]
                                                          ? Object.entries(
                                                                value[
                                                                    el.payload
                                                                ][elementIndex]
                                                            )
                                                          : [['', '']]
                                                  return (
                                                      elementIndex ===
                                                          index && (
                                                          <div
                                                              className="filter-input-box"
                                                              key={counter}
                                                          >
                                                              {el.values.map(
                                                                  (item) => (
                                                                      <Fragment
                                                                          key={
                                                                              item.title
                                                                          }
                                                                      >
                                                                          <label>
                                                                              {
                                                                                  item.title
                                                                              }
                                                                          </label>
                                                                          {item.title ===
                                                                              'Label' ||
                                                                          item.title ===
                                                                              'Annotation' ? (
                                                                              <TextInput
                                                                                  options={
                                                                                      el.payload ===
                                                                                      'labels'
                                                                                          ? LABELS
                                                                                          : ANNOTATIONS
                                                                                  }
                                                                                  trigger={
                                                                                      ''
                                                                                  }
                                                                                  matchAny={
                                                                                      true
                                                                                  }
                                                                                  Component="input"
                                                                                  value={
                                                                                      curentKey
                                                                                  }
                                                                                  spacer={
                                                                                      ''
                                                                                  }
                                                                                  onChange={(
                                                                                      e
                                                                                  ) =>
                                                                                      this.handleFilterInput(
                                                                                          e,
                                                                                          el.payload,
                                                                                          item.payload,
                                                                                          counter
                                                                                      )
                                                                                  }
                                                                              />
                                                                          ) : (
                                                                              <input
                                                                                  type="text"
                                                                                  value={
                                                                                      currentVal
                                                                                  }
                                                                                  onChange={(
                                                                                      e
                                                                                  ) =>
                                                                                      this.handleFilterInput(
                                                                                          e
                                                                                              .target
                                                                                              .value,
                                                                                          el.payload,
                                                                                          item.payload,
                                                                                          counter
                                                                                      )
                                                                                  }
                                                                              />
                                                                          )}
                                                                      </Fragment>
                                                                  )
                                                              )}
                                                              {value[
                                                                  el.payload
                                                              ] && (
                                                                  <button
                                                                      type="button"
                                                                      onClick={() =>
                                                                          this.deleteFilter(
                                                                              el.payload,
                                                                              counter
                                                                          )
                                                                      }
                                                                  >
                                                                      &times;
                                                                  </button>
                                                              )}
                                                          </div>
                                                      )
                                                  )
                                              }
                                          )
                                        : el.values.map((item) => (
                                              <button
                                                  name={el.payload}
                                                  title={item.payload}
                                                  key={item.payload}
                                                  className={
                                                      this.state.value[
                                                          el.payload
                                                      ] === item.payload
                                                          ? 'selected-filter'
                                                          : ''
                                                  }
                                                  onClick={(e) =>
                                                      this.handleFilterChange(e)
                                                  }
                                              >
                                                  {item.title}
                                              </button>
                                          ))}
                                    {!!value[el.payload] &&
                                        this.checkForInputFilter(
                                            el.payload
                                        ) && (
                                            <div>
                                                <button
                                                    type="button"
                                                    className="add-filter-btn"
                                                    onClick={() =>
                                                        this.addInputField(
                                                            el.payload
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </details>
                        ))}
                        {!isEmptyArray(this.markers.values) && (
                            <details open key={this.markers.payload}>
                                <summary
                                    className={cx('filter-list inner', {
                                        'is-active': !!value[
                                            this.markers.payload
                                        ],
                                    })}
                                >
                                    {this.markers.shownValue}
                                </summary>
                                <div className="inner-items">
                                    {this.markers.values.map((item) => (
                                        <button
                                            title={item.name}
                                            key={item.name}
                                            className={
                                                value.markers &&
                                                value.markers.find(
                                                    (marker) =>
                                                        marker === item.name
                                                )
                                                    ? 'selected-filter'
                                                    : ''
                                            }
                                            onClick={(e) =>
                                                this.handleMarkerFilterChange(e)
                                            }
                                        >
                                            <MarkerPreview
                                                shape={item.shape}
                                                color={item.color}
                                            />
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                    <div className="search-results">
                        {isEmptyArray(result) ? (
                            <div className="result-placeholder">
                                No items to show
                            </div>
                        ) : (
                            <>
                                {result.map((item, index) => (
                                    <DnShortcutComponent
                                        key={index}
                                        dn={item.dn}
                                        sharedState={this.sharedState}
                                    />
                                ))}
                                {result.length === 200 && (
                                    <div className="limited-results-msg">
                                        The first 200 items are shown. Please
                                        refine your search query to see more
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Search
