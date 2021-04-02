import React, { useState } from "react"
import { sharedState } from "../../../configureService"
import { fetchSearchResult } from "../util"

export const SearchInput = () => {
    const [criteria, setCriteria] = useState<string>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value
        sharedState.set("search_input", input)
        setCriteria(input)
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
