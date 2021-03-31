import React, { useState, useEffect } from "react"
import { Search } from "../"
import { sharedState } from "../../../configureService"

export const SearchInput = () => {
    const [criteria, setCriteria] = useState<string>("")
    useEffect(() => {
        sharedState.subscribe("search_value", (search_value) => {
            setCriteria(search_value ? search_value.criteria : "")
        })
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value
        const valueInState = sharedState.get("search_value") || {}

        if (!input) {
            delete valueInState.criteria
            sharedState.set("search_value", { ...valueInState })
        } else {
            sharedState.set("search_value", {
                ...valueInState,
                criteria: input,
            })
        }
        const searchService = new Search([])
        searchService.fetchSearchResults(sharedState.get("search_value") || {})
    }
    return (
        <div className="form-group has-success">
            <input
                type="text"
                className="form-control search-input"
                placeholder="Search"
                value={criteria}
                autoFocus
                onChange={(e) => handleChange(e)}
            />
        </div>
    )
}
