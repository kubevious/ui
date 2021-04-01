import React, { useState, useEffect } from "react"
import { sharedState } from "../../../configureService"
import { fetchSearchResult } from "../util"

export const SearchInput = () => {
    const [criteria, setCriteria] = useState<string>("")
    useEffect(() => {
        sharedState.subscribe("search_value", (search_value) => {
            setCriteria(search_value ? search_value.criteria : "")
        })
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value
        let valueInState = sharedState.get("search_value") || {}

        if (!input) {
            delete valueInState.criteria
        } else {
            valueInState = {
                ...valueInState,
                criteria: input,
            }
        }
        sharedState.set("search_value", valueInState)

        fetchSearchResult()
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
