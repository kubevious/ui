import { FilterEntry } from "./types"

export const LIMITED_RESULTS_MSG = 'The first 200 items are shown. Please refine your search query to see more'

export const NO_SEARCH_RESULT_MSG = 'No search criteria defined'

export const NO_ITEMS_MATCHING_MSG = 'No items matching search criteria'

export const FILTER_ENTRIES_WARNINGS: FilterEntry[] = [
    {
        caption: "With warnings",
        value: {
            kind: "at-least",
            count: 1,
        },
    },
    {
        caption: "Without warnings",
        value: {
            kind: "at-most",
            count: 0,
        },
    },
]

export const FILTER_ENTRIES_ERRORS: FilterEntry[] = [
    {
        caption: "With errors",
        value: {
            kind: "at-least",
            count: 1,
        },
    },
    {
        caption: "Without errors",
        value: {
            kind: "at-most",
            count: 0,
        },
    },
]

export const INITIAL_AUTOCOMPLETE = {
    labels: {
        keys: [],
        values: [],
    },
    annotations: {
        keys: [],
        values: [],
    },
}
