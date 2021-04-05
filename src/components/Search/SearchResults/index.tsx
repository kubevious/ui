import React, { useEffect, useState } from "react"
import { DnShortcutComponent } from "@kubevious/ui-components"
import { SelectedData } from "../../../types"
import { isEmptyArray } from "../../../utils/util"
import { sharedState } from "../../../configureService"
import { LIMITED_RESULTS_MSG, NO_ITEMS_MATCHING_MSG, NO_SEARCH_RESULT_MSG } from "../constants"

export const SearchResults = () => {
    const [result, setResult] = useState<SelectedData[]>([])
    const [totalCount, setTotalCount] = useState<number>(0)
    const [wasFiltered, setWasFiltered] = useState<boolean>(false)

    useEffect(() => {
        sharedState.subscribe("search_result", (search_result) => {
            setResult(search_result)
            setTotalCount(sharedState.get("total_count"))
            setWasFiltered(sharedState.get("was_filtered"))
        })
    }, [])

    return (
        <div className="search-results">
            {isEmptyArray(result) ? (
                <div className="result-placeholder">
                    {wasFiltered
                        ? NO_ITEMS_MATCHING_MSG
                        : NO_SEARCH_RESULT_MSG}
                </div>
            ) : (
                <>
                    {result &&
                        result.map((item, index) => (
                            <DnShortcutComponent key={index} dn={item.dn} />
                        ))}
                    {result.length < totalCount && (
                        <div className="limited-results-msg">
                            {LIMITED_RESULTS_MSG}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
