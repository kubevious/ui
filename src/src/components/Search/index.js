import React  from 'react'
import { isEmptyArray, isEmptyObject } from '../../utils/util'
import DnShortcutComponent from '../DnShortcutComponent'
import BaseComponent from '../../HOC/BaseComponent'
import { FILTERS_LIST } from '../../boot/filterData'

import './styles.scss'

class Search extends BaseComponent {
    constructor(props) {
        super(props);

        this.registerService({ kind: 'diagram' })

        this.state = {
            result: [],
            value: {},
            filtersInput: {}
        }
    }

    fetchResults(criteria) {
        this.service.fetchSearchResults(criteria, result => {
            this.setState({ result: result })
        })
    }

    handleChange(e) {
        const input = e.target.value
        this.setState(prevState => {
            if (isEmptyArray(input)) {
                delete prevState.value.criteria
                return {
                    value: { ...prevState.value }
                }
            }
            return {
                value: { ...prevState.value, criteria: input }
            }
        }, () => {
            this.fetchResults(this.state.value)
        })
    }

    handleFilterChange(e) {
        const { name, title } = e.target
        this.setState(prevState => {
            if (prevState.value[name] === title) {
                delete prevState.value[name]
                return {
                    value: { ...prevState.value }
                }
            }
            return {
                value: { ...prevState.value, [name]: title }
            }
        }, () => {
            this.fetchResults(this.state.value)
        })
    }

    handleFilterInput(e) {
        const { value, name, title } = e.target
        this.setState((prevState) => ({
            filtersInput: {
                ...prevState.filtersInput,
                [name]: { ...prevState.filtersInput[name], [title]: value },
            },
        }), () => {
            this.setFilterInput(name, title)
        })
    }

    enableFilterFromInput(e) {
        const { name, title } = e.target

        this.setFilterInput(name, title)
    }

    setFilterInput(name, title) {
        const selectedFilter = this.state.filtersInput[name]

        if (!selectedFilter) {
            return
        }

        this.setState(prevState => {
            const { [name]: prevFilter } = prevState.value
            const { [title]: prevFilterCond } = prevFilter || {}
            if (prevFilter && prevFilterCond === selectedFilter[title]) {
                delete prevState.value[name][title]
                isEmptyObject(prevFilter) && delete prevState.value[name]

                return {
                    value: { ...prevState.value }
                }
            }
            return {
                value: { ...prevState.value, [name]: { ...prevFilter, [title]: selectedFilter[title] } }
            }
        }, () => {
            this.fetchResults(this.state.value)
        })
    }

    clearInput() {
        this.setState({ value: {} })
    }

    render() {
        const { result, value } = this.state

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
                <div className="search-area">
                    <div className="filter-list filter-box">
                        {FILTERS_LIST.map((el) => (
                            <details open>
                                <summary className="filter-list inner">
                                    {el.shownValue}
                                </summary>
                                <div className="inner-items">
                                    {el.values.map((item) =>
                                        el.payload === 'label' ||
                                        el.payload === 'annotations' ? (
                                            <div>
                                                <input
                                                    name={el.payload}
                                                    title={item.payload}
                                                    id={el.payload + item.payload}
                                                    checked={this.state.value[el.payload] && this.state.value[el.payload][item.payload]}
                                                    type="checkbox"
                                                    onChange={(e) =>
                                                        this.enableFilterFromInput(
                                                            e
                                                        )
                                                    }
                                                />
                                                <label
                                                    for={el.payload + item.payload}
                                                >
                                                    {item.title}
                                                </label>
                                                <input
                                                    name={el.payload}
                                                    title={item.payload}
                                                    type="text"
                                                    onChange={(e) =>
                                                        this.handleFilterInput(
                                                            e
                                                        )
                                                    }
                                                />
                                            </div>
                                        ) : (
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
                                        )
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
