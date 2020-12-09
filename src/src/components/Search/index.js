import React, { Fragment } from 'react'
import Autocomplete from 'react-autocomplete';
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import DocUtils from 'kubevious-helpers/lib/docs'
import { prettyKind } from '../../utils/ui-utils'
import DnShortcutComponent from '../DnShortcutComponent'
import BaseComponent from '../../HOC/BaseComponent'
import MarkerPreview from '../MarkerPreview'
import { FILTERS_LIST } from '../../boot/filterData'
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
            totalCount: 0,
            value: {},
            savedFilters: {},
            currentInput: {
                labels: {
                    key: '',
                    value: '',
                },
                annotations: {
                    key: '',
                    value: '',
                },
            },
            autocomplete: {
                labels: {
                    keys: [],
                    values: []
                },
                annotations: {
                    keys: [],
                    values: []
                }
            },
        }
    }

    fetchResults(criteria) {
        this.service.fetchSearchResults(criteria, (response) => {
            this.setState({
                result: response.results,
                totalCount: response.totalCount,
            })
        })
    }

    fetchValues(type, key, criteria) {
        if (!key) {
            return
        }
        this.service.fetchAutocompleteValues(type, { key, criteria }, (response) => {
                this.setState((prevState) => {
                    prevState.autocomplete[type].values = response
                    return {
                        autocomplete: {
                            ...prevState.autocomplete,
                        },
                    }
                })
            })

    }

    fetchKeys(type, criteria) {
        return this.service.fetchAutocompleteKeys(
            type,
            { criteria },
            (response) => {
                this.setState((prevState) => {
                    prevState.autocomplete[type].keys = response
                    return {
                        autocomplete: {
                            ...prevState.autocomplete,
                        },
                    }
                })
            }
        )
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

    handleFilterInput(value, name, title) {
        this.setState((prevState) => {
            if (title === 'key') {
                this.fetchKeys(name, value)
                prevState.currentInput[name].key = value
                return {
                    currentInput: {
                        ...prevState.currentInput,
                    },
                }
            }
            const currentKey = prevState.currentInput[name].key
            this.fetchValues(name, currentKey, value)
            prevState.currentInput[name].value = value
            return {
                currentInput: {
                    ...prevState.currentInput,
                },
            }
        })
    }

    addInputField(type) {
        this.setState(
            (prevState) => {
                const {
                    key: inputKey,
                    value: inputVal,
                } = prevState.currentInput[type]
                const searchValue = prevState.value[type] || []
                const elementIndex = searchValue.findIndex((el) => el[inputKey])
                const searchValueInSaved = prevState.savedFilters[type] || []
                const elementIndexInSaved = searchValueInSaved.findIndex((el) => el[inputKey])
                elementIndex !== -1
                    ? (searchValue[elementIndex] = { [inputKey]: inputVal })
                    : searchValue.push({ [inputKey]: inputVal })
                const filteredSaved = searchValueInSaved.filter((el, index) => index !== elementIndexInSaved)
                prevState.savedFilters[type] = filteredSaved
                isEmptyArray(filteredSaved) && delete prevState.savedFilters[type]
                prevState.currentInput[type] = { key: '', value: '' }
                return {
                    value: {
                        ...prevState.value,
                        [type]: searchValue,
                    },
                    savedFilters: {
                        ...prevState.savedFilters
                    },
                    currentInput: {
                        ...prevState.currentInput,
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
        return false
    }

    deleteFilter(key, val) {
        this.setState(
            (prevState) => {
                const currentFilters = prevState.value[key] || []
                const currentSavedFilters = prevState.savedFilters[key] || []
                const sumOfFilters = currentFilters.concat(currentSavedFilters)
                const [elementKey] = Object.keys(val)

                if (
                    typeof currentFilters === 'string' ||
                    typeof currentSavedFilters === 'string'
                ) {
                    prevState.value[key] && delete prevState.value[key]
                    prevState.savedFilters[key] &&
                        delete prevState.savedFilters[key]
                    return {
                        value: { ...prevState.value },
                        savedFilters: { ...prevState.savedFilters },
                    }
                }

                prevState.value[key] = currentFilters.filter(
                    (filter) => !filter[elementKey]
                )
                prevState.savedFilters[key] = currentSavedFilters.filter(
                    (filter) => !filter[elementKey]
                )

                isEmptyArray(prevState.value[key]) &&
                    delete prevState.value[key]
                isEmptyArray(prevState.savedFilters[key]) &&
                    delete prevState.savedFilters[key]

                return {
                    value: {
                        ...prevState.value,
                    },
                    savedFilters: {
                        ...prevState.savedFilters,
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
        return false
    }

    handleEditFilter(type, filterVal) {
        this.setState((prevState) => {
            const [[key, value]] = Object.entries(filterVal)
            prevState.currentInput[type] = {
                key,
                value,
                disabled: true,
            }
            return {
                currentInput: {
                    ...prevState.currentInput,
                },
            }
        })
    }

    toggleFilter(type, filterVal) {
        const [[key, value]] = Object.entries(filterVal)

        this.setState(
            (prevState) => {
                if (!this.checkForInputFilter(type)) {
                    const deleteFromSaved = () => {
                        prevState.value[type] = prevState.savedFilters[type]
                        delete prevState.savedFilters[type]
                    }

                    const addToSaved = () => {
                        prevState.savedFilters[type] = prevState.value[type]
                        delete prevState.value[type]
                    }
                    prevState.savedFilters[type]
                        ? deleteFromSaved()
                        : addToSaved()
                    return {
                        value: { ...prevState.value },
                        savedFilters: { ...prevState.savedFilters },
                    }
                }
                let valueArray = prevState.value[type] || []
                let savedArray = prevState.savedFilters[type] || []
                let changedValueArray = valueArray.filter((el) => !el[key])
                let changedSavedArray = savedArray.filter((el) => !el[key])

                if (prevState.savedFilters[type]) {

                    const compareLength =
                        changedSavedArray.length === savedArray.length

                    savedArray = compareLength
                        ? [...savedArray, { [key]: value }]
                        : changedSavedArray
                    valueArray = compareLength
                        ? changedValueArray
                        : [...valueArray, { [key]: value }]

                    prevState.value[type] = valueArray
                    prevState.savedFilters[type] = savedArray

                    if (isEmptyArray(valueArray)) {
                        delete prevState.value[type]
                        return
                    } else if (isEmptyArray(savedArray)) {

                        delete prevState.savedFilters[type]
                        return
                    }

                    return {
                        value: {
                            ...prevState.value,
                        },
                        savedFilters: {
                            ...prevState.savedFilters,
                        },
                    }
                }
                prevState.value[type] = changedValueArray
                isEmptyArray(changedValueArray) && delete prevState.value[type]
                return {
                    value: { ...prevState.value },
                    savedFilters: {
                        ...prevState.savedFilters,
                        [type]: [{ [key]: value }],
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    clearFilter(type) {
        this.setState((prevState) => {
            const { key } = prevState.currentInput[type]
            const changedValueArray =
                prevState.value[type] &&
                prevState.value[type].filter((elem) => !elem[key])

            isEmptyArray(changedValueArray)
                ? delete prevState.value[type]
                : (prevState.value[type] = changedValueArray)
            return {
                currentInput: {
                    ...prevState.currentInput,
                    [type]: {
                        key: '',
                        value: '',
                    },
                    value: {
                        ...prevState.value,
                    },
                },
            }
        },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    renderPrettyView(val) {
        const [[key, value]] = Object.entries(val)
        return Array.isArray(val)
            ? val.map((criteria, index) => index === val.length - 1 ? criteria : `${criteria} | `)
            : `${key}: ${value}`
    }

    renderActiveFilters(type, val) {
        const { savedFilters } = this.state
        const [elementKey] = typeof val === 'string' ? [''] : Object.keys(val)
        const checkInSavedFilters =
            savedFilters[type] && elementKey
                ? savedFilters[type].find((el) => el[elementKey])
                : savedFilters[type]
        if (!val) return
        return (
            <div
                className={cx('active-filter-box', {
                    deactivated: checkInSavedFilters,
                })}
                key={type}
            >
                <span className="filter-key">{`${type}: `}</span>
                <span className="filter-val">
                    {typeof val === 'string'
                        ? prettyKind(val)
                        : this.renderPrettyView(val)}
                </span>
                {this.checkForInputFilter(type) && (
                    <button
                        className="filter-btn edit"
                        onClick={() => this.handleEditFilter(type, val)}
                    ></button>
                )}
                <button
                    className={cx('filter-btn toggle-show', {
                        hide: checkInSavedFilters,
                    })}
                    title="Toggle show/hide"
                    onClick={() => this.toggleFilter(type, val)}
                />
                <button
                    className="filter-btn del"
                    title="Delete"
                    onClick={() => this.deleteFilter(type, val)}
                >
                    &times;
                </button>
            </div>
        )
    }

    compareForSort(a, b) {
        let [valA] = Object.keys(a)
        let [valB] = Object.keys(b)
        valA = valA.toUpperCase()
        valB = valB.toUpperCase()

        let comparison = 0;
        if (valA > valB) {
            comparison = 1;
        } else if (valA < valB) {
            comparison = -1;
        }
        return comparison;
    }

    renderDividedActiveFilters(key, val) {
        if (!val) {
            return
        }
        const saved = this.state.savedFilters[key] || []
        const sumOfValues = this.state.value[key]
            ? this.state.value[key].concat(saved)
            : saved

        return sumOfValues.sort(this.compareForSort).map((filter) => {
            if (!isEmptyObject(filter)) {
                return this.renderActiveFilters(key, filter)
            }
            return
        })
    }

    render() {
        const {
            result,
            totalCount,
            value,
            savedFilters,
            currentInput,
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
                <div className="active-filters">
                    {(!isEmptyObject(value) || !isEmptyObject(savedFilters)) && (
                        <>
                            {Object.entries(
                                Object.assign({}, value, savedFilters)
                            ).sort().map(
                                ([key, val]) =>
                                    key !== 'criteria' &&
                                    (this.checkForInputFilter(key)
                                        ? this.renderDividedActiveFilters(key, val)
                                        : this.renderActiveFilters(key, val))
                            )}
                        </>
                    )}
                </div>
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
                                    {this.checkForInputFilter(el.payload) ? (
                                        <div className="filter-input-box">
                                            {el.values.map((item) => {
                                                const currentKey =
                                                    currentInput[el.payload].key
                                                const currentVal =
                                                    currentInput[el.payload]
                                                        .value
                                                return (
                                                    <Fragment key={item.title}>
                                                        <label>
                                                            {item.title}
                                                        </label>
                                                        {item.title ===
                                                            'Label' ||
                                                        item.title ===
                                                            'Annotation' ? (
                                                            <Autocomplete
                                                                getItemValue={(e) => e}
                                                                items={this.state.autocomplete[
                                                                    el.payload
                                                                ].keys}
                                                                value={
                                                                    currentKey
                                                                }
                                                                onChange={(e) =>
                                                                    this.handleFilterInput(
                                                                        e.target
                                                                            .value,
                                                                        el.payload,
                                                                        item.payload
                                                                    )
                                                                }
                                                                onSelect={(val) =>
                                                                    this.handleFilterInput(
                                                                        val,
                                                                        el.payload,
                                                                        item.payload
                                                                    )
                                                                }
                                                                renderItem={(e) => (
                                                                    <div>
                                                                        {e}
                                                                    </div>
                                                                )}
                                                                renderMenu={(items) => (
                                                                    <div
                                                                        className="autocomplete"
                                                                        children={
                                                                            items
                                                                        }
                                                                    />
                                                                )}
                                                                renderInput={(props) => (
                                                                    <input
                                                                        disabled={
                                                                            currentInput[
                                                                                el
                                                                                    .payload
                                                                            ]
                                                                                .disabled
                                                                        }
                                                                        {...props}
                                                                    />
                                                                )}
                                                                onMenuVisibilityChange={() => this.fetchKeys(el.payload, currentKey)}
                                                            />
                                                        ) : (
                                                            <Autocomplete
                                                                getItemValue={(e) => e}
                                                                items={this.state.autocomplete[
                                                                    el.payload
                                                                ].values}
                                                                value={
                                                                    currentVal
                                                                }
                                                                onChange={(e) =>
                                                                    this.handleFilterInput(
                                                                        e.target
                                                                            .value,
                                                                        el.payload,
                                                                        item.payload
                                                                    )
                                                                }
                                                                onSelect={(val) =>
                                                                    this.handleFilterInput(
                                                                        val,
                                                                        el.payload,
                                                                        item.payload
                                                                    )
                                                                }
                                                                renderItem={(e) => (
                                                                    <div>
                                                                        {e}
                                                                    </div>
                                                                )}
                                                                renderMenu={(items) => (
                                                                    <div
                                                                        className="autocomplete"
                                                                        children={
                                                                            items
                                                                        }
                                                                    />
                                                                )}
                                                                renderInput={(props) => (
                                                                    <input
                                                                        disabled={
                                                                            !currentKey
                                                                        }
                                                                        {...props}
                                                                    />
                                                                )}
                                                                onMenuVisibilityChange={() => this.fetchValues(el.payload, currentKey, currentVal)}
                                                            />
                                                        )}
                                                    </Fragment>
                                                )
                                            })}
                                            {currentInput[el.payload].key &&
                                                currentInput[el.payload]
                                                    .value && (
                                                    <div className="filter-input-btns">
                                                        <button
                                                            type="button"
                                                            className="add-filter-btn"
                                                            onClick={() =>
                                                                this.addInputField(
                                                                    el.payload
                                                                )
                                                            }
                                                        >
                                                            Add
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                this.clearFilter(
                                                                    el.payload
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    ) : (
                                        el.values.map((item) => (
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
                                        ))
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
                                {result.length < totalCount && (
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
