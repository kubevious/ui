import React from 'react'
import { renderToString } from 'react-dom/server'
import $ from 'jquery'
import { isEmptyArray } from '../../utils/util'
import DnShortcutComponent from '../DnShortcutComponent'

import './styles.scss'

const Search = ({ service, state }) => {
    setTimeout(() => {
        $('.search-input').on('input', (e) => {
            service.fetchSearchResults(e.target.value, result => {
                renderSearchResult(result)
            })
        })
    }, 0)

    const renderSearchResult = (result) => {
        const html = renderToString(<>
            {!isEmptyArray(result) && result.map((item, index) => (
                <DnShortcutComponent key={index} dn={item.dn} state={state}/>
            ))}
        </>)

        $('.search-results').append(html)
    }

    return (
        <div className="search-results"/>
    )
}

export default Search
