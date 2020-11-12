import React  from 'react'
import { isEmptyArray } from '../../utils/util'
import DnShortcutComponent from '../DnShortcutComponent'
import BaseComponent from '../../HOC/BaseComponent'
import { FILTERS_LIST } from '../../boot/filterData'
import $ from 'jquery'

import './styles.scss'

class Search extends BaseComponent {
    constructor(props) {
        super(props);

        this.registerService({ kind: 'diagram' })

        this.state = {
            value: '',
            result: []
        }
    }

    handleChange(e) {
        this.setState({ value: e.target.value })
        this.service.fetchSearchResults(e.target.value, result => {
            this.setState({ result: result })
        })
    }

    handleFilterChange(e) {
        this.setState({ value: `(${e.target.name}):` })
        $('details').removeAttr('open')
        $('.search-input').trigger('focus')
    }

    render() {
        const { value, result } = this.state

        return (
            <div className="Search-wrapper p-40 overflow-hide">
                <div className="form-group has-success">
                    <details>
                        <summary className="form-control filter-list" title="Filter">Filter</summary>
                        <div className="filter-box">
                        {FILTERS_LIST.map(el => (
                            <button name={el.payload} onClick={(e) => this.handleFilterChange(e)}>{el.shownValue}</button>
                        ))}
                        </div>
                        </details>
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search"
                        value={value}
                        autoFocus={true}
                        onChange={(e) => this.handleChange(e)}
                    />
                    <p className="user-tip">Tip: you can add more filters by typing in format <i>(filter):value</i></p>
                </div>
                <div className="search-results">
                    {!isEmptyArray(result) && result.map((item, index) => (
                        <DnShortcutComponent key={index} dn={item.dn} sharedState={this.sharedState}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default Search
