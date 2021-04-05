import { FilterEntry, AutocompleteValues } from "./types"

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

export const INITIAL_AUTOCOMPLETE: AutocompleteValues = {
    labels: {
        keys: [],
        values: [],
    },
    annotations: {
        keys: [],
        values: [],
    },
}
