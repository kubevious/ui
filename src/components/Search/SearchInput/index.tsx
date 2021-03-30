import React from "react"

export const SearchInput = ({
    criteria,
    handleChange
} : {
    criteria: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
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
