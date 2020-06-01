import React, { useState } from 'react'
import { isEmptyArray } from '../../utils/util'
import DnShortcutComponent from '../DnShortcutComponent'

import './styles.scss'

const Search = ({ service, sharedState, closePopup }) => {
    const [value, setValue] = useState('')
    const [result, setResult] = useState([])

    const handleChange = (e) => {
        setValue(e.target.value)
        service.fetchSearchResults(e.target.value, result => {
            setResult(result)
        })
    }

    return (
        <>
            <div className="form-group has-success">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search"
                    value={value}
                    onChange={(e) => handleChange(e)}
                />
            </div>
            <div className="search-results">
                {!isEmptyArray(result) && result.map((item, index) => (
                    <DnShortcutComponent key={index} dn={item.dn} sharedState={sharedState}/>
                ))}
            </div>
            <button className="close" onClick={() => closePopup()}/>
        </>
    )
}

export default Search
