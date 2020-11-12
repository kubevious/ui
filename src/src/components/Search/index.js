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
            value: '',
            result: [],
            filtered: false
        }
    }

    fetchResults(criteria) {
        this.service.fetchSearchResults(criteria, result => {
            this.setState({ result: result })
        })
    }

    handleChange(e) {
        this.setState({ value: e.target.value })
        this.fetchResults(e.target.value)
    }

    handleFilterChange(e) {
        this.setState({ filtered: true })
        const { name, title } = e.target
        if (this.state.value.includes(name)) {
            const valueRegexp = new RegExp(`\\((${name}\\):\\w+(\\S|))`, 'ig')

            this.setState(prevState => ({ value: prevState.value.replace(valueRegexp, `(${name}):${title}`) }))
            setTimeout(() => { this.fetchResults(this.state.value) })

            return
        }
        this.setState(prevState => ({ value: `(${name}):${title} ${prevState.value}` }))
        setTimeout(() => { this.fetchResults(this.state.value) })
    }

    clearInput() {
        this.setState({ value: '', filtered: false })
    }

    render() {
        const { value, result } = this.state

        return (
            <div className="Search-wrapper p-40 overflow-hide">
                <div className="form-group has-success">
                    <details>
                        <summary className="form-control filter-list" title="Filter">
                            Filter
                            {this.state.filtered && <a className="clear-input-btn" title="Clear" onClick={() => this.clearInput()}></a>}
                        </summary>
                        <div className="filter-box">
                        {FILTERS_LIST.map(el => (
                            <details>
                                <summary className="filter-list inner">{el.shownValue}</summary>
                                <div className='inner-items'>
                                {el.values.map(item => (
                                    <button name={el.payload} title={item.payload} onClick={(e) => this.handleFilterChange(e)}>{item.title}</button>
                                ))}
                                </div>
                            </details>
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
