import React  from 'react'
import { isEmptyArray } from '../../utils/util'
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
            if (input.length === 0) {
                delete prevState.value.criteria
                return {
                    value: { ...prevState.value }
                }
            }
            return {
                value: { ...prevState.value, criteria: input }
            }
        })
        setTimeout(() => {
            this.fetchResults(this.state.value)
        })
    }

    handleFilterChange(e) {
        const shouldUnselect = e.target.classList.contains('selected-filter')
        e.target.parentNode.childNodes.forEach(el => el.classList.remove('selected-filter'))
        !shouldUnselect && e.target.classList.add('selected-filter')

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
        }})

        setTimeout(() => {
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
                        autoFocus={true}
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
                <div className="search-area">
                    <div className="filter-list filter-box">
                        {FILTERS_LIST.map(el => (
                            <details open>
                                <summary className="filter-list inner">{el.shownValue}</summary>
                                <div className='inner-items'>
                                {el.values.map(item => (
                                    <button name={el.payload} title={item.payload} onClick={(e) => this.handleFilterChange(e)}>{item.title}</button>
                                ))}
                                </div>
                            </details>
                        ))}
                    </div>
                    <div className="search-results">
                        {isEmptyArray(result)
                                ? <div className="result-placeholder">No items to show</div>
                                : result.map((item, index) => (
                            <DnShortcutComponent key={index} dn={item.dn} sharedState={this.sharedState}/>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Search
