import React from "react"
import { DnShortcutComponent } from "@kubevious/ui-components"
import { SelectedData } from "../../../types"
import { isEmptyArray } from "../../../utils/util"

export const SearchResults = ({
    wasFiltered,
    result,
    totalCount
}: {
    wasFiltered: boolean,
    result: SelectedData[],
    totalCount: number
}) => {

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
