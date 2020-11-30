import React, { Fragment } from 'react'
import TextInput from 'react-autocomplete-input';
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import DocUtils from 'kubevious-helpers/lib/docs'
import { prettyKind } from '../../utils/ui-utils'
import DnShortcutComponent from '../DnShortcutComponent'
import BaseComponent from '../../HOC/BaseComponent'
import { ANNOTATIONS, FILTERS_LIST, LABELS } from '../../boot/filterData'
import cx from 'classnames'

import './styles.scss'

class Search extends BaseComponent {
    constructor(props) {
        super(props)

        this.registerService({ kind: 'diagram' })

        this.kinds = this.getKindsList()

        this.state = {
            result: [],
            value: {},
            counters: {
                labels: {[+new Date]: ''},
                annotations: {[+new Date]: ''},
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

    checkForInputFilter(payload) {
        return payload === 'labels' || payload === 'annotations'
    }

    deleteFilter(key) {
        this.setState(
            (prevState) => {
                delete prevState.counters[key]
                delete prevState.value[key]
                return {
                    value: { ...prevState.value },
                    counters: {
                        ...prevState.counters,
                        [key]: { [+new Date()]: '' },
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
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
                return {
                    value: { ...prevState.value, [name]: title },
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
                const {[index]: selectedKey = ''} = prevState.counters[name]

                const foundVal =
                    !isEmptyArray(prevFilter) &&
                    prevFilter.find((x) => {
                        const [currentKey] = Object.keys(x)
                        return currentKey === selectedKey
                    })
                const { [selectedKey]: prevFilterVal } = foundVal
                    ? foundVal
                    : { [selectedKey]: '' }

                if (title === 'key') {
                    const changedFilters = isEmptyArray(prevFilter)
                        ? [{ [value]: '' }]
                        : [
                              ...prevFilter.filter((el) => {
                                  const [currentKey] = Object.keys(el)
                                  if (currentKey === selectedKey) {
                                      return false
                                  }
                                  return true
                              }),
                              { [value]: prevFilterVal },
                          ]
                    return {
                        value: {
                            ...prevState.value,
                            [name]: changedFilters,
                        },
                        counters: {
                            ...prevState.counters,
                            [name]: {
                                ...prevState.counters[name],
                                [index]: value,
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
        this.setState(prevState => {
            const prevCounters = prevState.counters
            const current = prevCounters[type]
            return {
                counters: { ...prevCounters, [type]: {...current, [+new Date]: ''}}
            }
        })
        return false
    }

    deleteInputField(key, counter) {
        this.setState(
            (prevState) => {
                const currentFilters = prevState.value[key] || []
                const currentCounters = prevState.counters[key] || {}
                const deletedCounter = currentCounters[counter]
                delete currentCounters[counter]
                if (!currentFilters || currentFilters.length === 1) {

                    delete prevState.value[key]
                    delete prevState.counters[key][counter]
                    return {
                        value: { ...prevState.value },
                        counters: {...prevState.counters, [key]: {[+new Date]: ''}}
                    }
                }
                return {
                    value: { ...prevState.value, [key]: currentFilters.filter(x => !x[deletedCounter]) },
                    counters: {...prevState.counters, [key]: currentCounters}
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
        return false
    }

    renderPrettyView(val) {
        return val.map((el, index) => {
            const [[key, value]] = Object.entries(el)
            return index === val.length - 1 ? `${key}: ${value}` : `${key}: ${value} | `
        })
    }

    render() {
        const { result, value, counters } = this.state

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
                {!isEmptyObject(value) && (
                    <div className="active-filters">
                        {Object.entries(value).map(
                            ([key, val]) =>
                                key !== 'criteria' && (
                                    <div className="active-filter-box" key={key}>
                                        <span className="filter-key">{`${key}: `}</span>
                                        <span className="filter-val">
                                            {typeof val === 'string'
                                                ? prettyKind(val)
                                                : this.renderPrettyView(val)}
                                        </span>
                                        <button
                                            className="filter-del-btn"
                                            onClick={() =>
                                                this.deleteFilter(key)
                                            }
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )
                        )}
                    </div>
                )}
                <div className="search-area">
                    <div className="filter-list filter-box">
                        {[this.kinds, ...FILTERS_LIST].map((el) => (
                            <details open key={el.payload}>
                                <summary
                                    className={cx('filter-list inner', {
                                        'is-active': !!this.state.value[
                                            el.payload
                                        ],
                                    })}
                                >
                                    {el.shownValue}
                                </summary>
                                <div className="inner-items">
                                    {this.checkForInputFilter(el.payload)
                                        ? Object.keys(counters[el.payload]).map((counter) => (
                                            <div
                                                className="filter-input-box"
                                                key={counter}
                                            >
                                                {el.values.map((item) => (
                                                <Fragment key={item.title}>
                                                    <label>
                                                        {item.title}
                                                    </label>
                                                    {item.title === 'Label' || item.title === 'Annotation'
                                                        ? <TextInput
                                                            options={el.payload === 'labels' ? LABELS : ANNOTATIONS}
                                                            trigger={''}
                                                            matchAny={true}
                                                            Component='input'
                                                            value={value[el.payload] ? value[el.payload][item.payload] : ''}
                                                            spacer={''}
                                                            onChange={(e) =>
                                                            this.handleFilterInput(e, el.payload, item.payload, counter)
                                                            }
                                                        />
                                                        : <input
                                                            type="text"
                                                            value={value[el.payload] ? value[el.payload][item.payload] : ''}
                                                            onChange={(e) =>
                                                            this.handleFilterInput(e.target.value, el.payload, item.payload, counter)
                                                            }
                                                        />
                                                }
                                                </Fragment>
                                                ))}
                                                {value[el.payload] && <button
                                                    type="button"
                                                    onClick={() =>
                                                        this.deleteInputField(
                                                            el.payload, counter
                                                        )
                                                    }
                                                >
                                                    &times;
                                                </button>}
                                            </div>
                                          ))
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
                                                    this.addInputField(el.payload)
                                                }
                                            >
                                                +
                                            </button>
                                            </div>
                                        )}
                                </div>
                            </details>
                        ))}
                    </div>
                    <div className="search-results">
                        {isEmptyArray(result) ? (
                            <div className="result-placeholder">
                                No items to show
                            </div>
                        ) : (
                            result.map((item, index) => (
                                <DnShortcutComponent
                                    key={index}
                                    dn={item.dn}
                                    sharedState={this.sharedState}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Search
