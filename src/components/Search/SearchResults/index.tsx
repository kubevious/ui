import React, { useEffect, useState } from "react"
import { DnShortcutComponent } from "@kubevious/ui-components"
import { SelectedData } from "../../../types"
import { isEmptyArray } from "../../../utils/util"
import { sharedState } from "../../../configureService"

export const SearchResults = () => {
    const [result, setResult] = useState<SelectedData[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [wasFiltered, setWasFiltered] = useState<boolean>(false)

    useEffect(() => {
        sharedState.subscribe("search_result", (search_result) => {
            setResult(search_result)
            setTotalCount(sharedState.get("totalCount"))
            setWasFiltered(sharedState.get("wasFiltered"))
        })
    }, [])
    
    return (
        <div className="search-results">
            {isEmptyArray(result) ? (
                <div className="result-placeholder">
                    {wasFiltered
                        ? "No items matching search criteria"
                        : "No search criteria defined"}
                </div>
            ) : (
                <>
                    {result &&
                        result.map((item, index) => (
                            <DnShortcutComponent key={index} dn={item.dn} />
                        ))}
                    {result.length < totalCount && (
                        <div className="limited-results-msg">
                            The first 200 items are shown. Please refine your search
                            query to see more
                        </div>
                    )}
                </>
            )}
        </div>)
}
