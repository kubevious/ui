import { Search } from "."
import { sharedState } from "../../configureService"
import { FilterType } from "./types"

export const checkForInputFilter = (payload: string): boolean => {
    return payload === "labels" || payload === "annotations"
}

export const keyCheck = (el: FilterType, key: string): boolean => {
    return typeof el !== "string" && el.key === key
}

export const fetchSearchResult = () => {
    const searchService = new Search([])
    searchService.fetchSearchResults(sharedState.get("search_value") || {})
}

export const fetchAutocomplete = (type: string, criteria: string): void => {
  const searchService = new Search([])
  searchService.fetchAutocomplete(type, criteria)
}

export const fetchAutocompleteValues = (type: string, key: string, criteria: string): void => {
  const searchService = new Search([])
  searchService.fetchAutocompleteValues(type, key, criteria)
}

