import { Search } from "."
import { sharedState } from "../../configureService"
import { FilterType } from "./types"

export const keyCheck = (el: FilterType, key: string): boolean => {
    return typeof el !== "string" && el.key === key
}

export const fetchSearchResult = () => {
    const searchService = new Search([])
    searchService.fetchSearchResults()
}

export const fetchAutocomplete = (type: string, criteria: string): void => {
    const searchService = new Search([])

    searchService.fetchAutocompleteKeys(type, { criteria }, (response) => {
        const autocomplete = sharedState.get("autocomplete") || {}
        autocomplete[type].keys = response
        sharedState.set("autocomplete", autocomplete)
    })
}

export const fetchAutocompleteValues = (
    type: string,
    key: string,
    criteria: string
): void => {
    const searchService = new Search([])
    if (!key) {
        return
    }

    searchService.fetchAutocompleteValues(
        type,
        { key, criteria },
        (response) => {
            const autocomplete = sharedState.get("autocomplete") || {}
            autocomplete[type].values = response
            sharedState.set("autocomplete", autocomplete)
        }
    )
}
