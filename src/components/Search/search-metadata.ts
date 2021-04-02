import { FilterItem } from "./types"

import { SearchLabel } from "./Filters/SearchLabel"
import { SearchMarkers } from "./Filters/SearchMarkers"
import { SearchAnnotation } from "./Filters/SearchAnnotation"
import { SearchWarnings } from "./Filters/SearchWarnings"
import { SearchErrors } from "./Filters/SearchErrors"
import { SearchKinds } from "./Filters/SearchKinds"

export const alertsEnum = Object.freeze({ 0: "at-most", 1: "at-least" })

export const FILTERS_LIST: FilterItem[] = [
    {
        searchId: 'markers',
        payload: "markers",
        title: "Markers",
        component: SearchMarkers
    },
    {
        searchId: 'labels',
        payload: "labels",
        title: "Labels",
        component: SearchLabel
    },
    {
        searchId: 'annotations',
        payload: "annotations",
        title: "Annotations",
        component: SearchAnnotation
    },
    {
        searchId: 'warnings',
        payload: "warnings",
        title: "Warnings",
        component: SearchWarnings
    },
    {
        searchId: 'errors',
        payload: "errors",
        title: "Errors",
        component: SearchErrors
    },
    {
        searchId: 'kind',
        payload: "kind",
        title: "Kinds",
        component: SearchKinds
    },
]
