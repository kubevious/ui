import React, { useState } from 'react'
import { isEmptyArray } from '../../utils/util'
import DnShortcutComponent from '../DnShortcutComponent'

import './styles.scss'

const Search = ({ service, hideSearch, state }) => {
    const [data, setData] = useState([])

    const performSearch = (e) => {
        const value = e.target.value
        service.fetchSearchResults(value, result => {
            setData(result)
        })
    }

    return (
        <div id="popup" className="popup search-popup">
            <div className="form-group has-success">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search"
                    onChange={(e) => performSearch(e)}
                />
            </div>
            <div className="search-results">
                {!isEmptyArray(data) && data.map((item, index) => (
                    <DnShortcutComponent key={index} dn={item.dn} state={state} hidePopup={hideSearch}/>
                ))}
            </div>

            <button className="close" onClick={hideSearch}/>
        </div>
    )
}

export default Search
