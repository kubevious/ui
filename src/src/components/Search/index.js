import React from 'react'
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import DnShortcutComponent from '../DnShortcutComponent'
import BaseComponent from '../../HOC/BaseComponent'
import { FILTERS_LIST } from '../../boot/filterData'
import cx from 'classnames'

import './styles.scss'

class Search extends BaseComponent {
    constructor(props) {
        super(props)

        this.registerService({ kind: 'diagram' })

        this.state = {
            result: [],
            value: {},
            counters: [{
                labels: [1]
            }, {
                annotations: [1]
            }],
        }
    }

    fetchResults(criteria) {
        this.service.fetchSearchResults(criteria, (result) => {
            this.setState({ result: result })
        })
    }

    checkForInputFilter(payload) {
        return payload === 'labels' || payload === 'annotations'
    }

    deleteFilter(key, index) {
        this.setState(
            (prevState) => {
                const currentFilters = prevState.value[key]
                const changedCounters = prevState.counters.map(x => {
                    const [type] = Object.keys(x)
                    if (type === key) {
                        const filteredCounter = x[key].length > 1 ? x[key].filter(x => x !== index) : x[key]
                        return { [key]: filteredCounter }
                    }
                    return x
                })
                if (currentFilters.length === 1) {
                    delete prevState.value[key]
                    return {
                        value: { ...prevState.value },
                        counters: changedCounters
                    }
                }
                return {
                    value: { ...prevState.value, [key]: currentFilters.filter((x, i) => i !== (index - 1)) },
                    counters: changedCounters
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

    handleFilterInput(e, index) {
        const { value, name, title } = e.target

        this.setState(
            (prevState) => {
                const { [name]: prevFilter = [] } = prevState.value
                if (title === 'key') {
                    const [prevFilterVal = ''] = Object.values(prevFilter[index - 1] || {})
                    return (prevFilter && !isEmptyObject(prevFilter[index - 1]))
                        ? {
                              value: {
                                  ...prevState.value,
                                [name]: Object.values({ ...prevFilter, [index - 1]: {[value]: prevFilterVal}}),
                              },
                          }
                        : {
                              value: {
                                  ...prevState.value,
                                  [name]: [...prevFilter, { [value]: '' }],
                              },
                          }
                }
                const [prevFilterKey] = Object.keys(prevState.value[name][index - 1] || {})
                return (prevFilter && prevFilter[index - 1])
                    ? {
                        value: {
                            ...prevState.value,
                            [name]: Object.values({ ...prevFilter, [index - 1]: { [prevFilterKey]: value }})
                        }
                    }
                    : {
                        value: {
                            ...prevState.value,
                            [name]: [...prevFilter, { 'key': [value] }],
                        },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    enableFilterFromInput(e) {
        const { name, title } = e.target

        this.setFilterInput(name, title)
    }

    setFilterInput(name, title) {
        const selectedFilter = this.state.value[name]

        if (!selectedFilter) {
            return
        }

        this.setState(
            (prevState) => {
                const { [name]: prevFilter } = prevState.value
                const { [title]: prevFilterCond } = prevFilter || {}
                if (prevFilter && prevFilterCond === selectedFilter[title]) {
                    delete prevState.value[name][title]
                    isEmptyObject(prevFilter) && delete prevState.value[name]

                    return {
                        value: { ...prevState.value },
                    }
                }
                return {
                    value: {
                        ...prevState.value,
                        [name]: {
                            ...prevFilter,
                            [title]: selectedFilter[title],
                        },
                    },
                }
            },
            () => {
                this.fetchResults(this.state.value)
            }
        )
    }

    clearInput() {
        this.setState({ value: {} })
    }

    addInputField(type) {
        this.setState(prevState => {
            const prevCounters = prevState.counters
            const current = prevState.counters.find(el => {
                const [key] = Object.keys(el)
                return (key === type)
            })
            return {
                counters: prevCounters.map((counter) =>
                    Object.keys(counter)[0] == Object.keys(current)[0]
                        ? { [type]: [...counter[type], counter[type].push(2)] }
                        : counter
                ),
            }
        })
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
                                    <div className="active-filter-box">
                                        <span className="filter-key">{`${key}: `}</span>
                                        <span className="filter-val">
                                            {typeof val === 'string'
                                                ? val
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
                        {FILTERS_LIST.map((el) => (
                            <details open>
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
                                        ? counters.map((counter) => (
                                            counter[el.payload] && counter[el.payload].map(current => (
                                              <div
                                                  className="filter-input-box"
                                                  key={current}
                                              >
                                                  {el.values.map((item) => (
                                                      <>
                                                          <label>
                                                              {item.title}
                                                          </label>
                                                          <input
                                                              name={el.payload}
                                                              title={
                                                                  item.payload
                                                              }
                                                              type="text"
                                                              value={value[el.payload] ? value[el.payload][item.payload] : ''}
                                                              onChange={(e) =>
                                                                this.handleFilterInput(e, current)
                                                              }
                                                          />
                                                      </>
                                                  ))}
                                                  {value[el.payload] && <button
                                                      onClick={() =>
                                                          this.deleteFilter(
                                                              el.payload, current
                                                          )
                                                      }
                                                  >
                                                      &times;
                                                  </button>}
                                                </div>
                                            ))
                                          ))
                                        : el.values.map((item) => (
                                              <button
                                                  name={el.payload}
                                                  title={item.payload}
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
