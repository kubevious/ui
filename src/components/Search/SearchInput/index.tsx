import React from "react"
import { Search } from "../"
import { SearchState } from "../types"

export const SearchInput = ({
    criteria,
    self,
}: {
    criteria: string,
    self: Search
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value
        self.setState(
            (prevState: SearchState) => {
                const valueInState = prevState.value || {}
                if (!input) {
                    delete valueInState.criteria
                    return {
                        ...prevState,
                        value: { ...valueInState },
                    }
                }
                return {
                    ...prevState,
                    value: { ...valueInState, criteria: input },
                }
            },
            () => {
                self.fetchResults(self.state.value)
            }
        )
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
        </div>)
}
