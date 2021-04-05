import { FilterItem } from "./types"

import { SearchLabel } from "./Filters/SearchLabel"
import { SearchMarkers } from "./Filters/SearchMarkers"
import { SearchAnnotation } from "./Filters/SearchAnnotation"
import { SearchWarnings } from "./Filters/SearchWarnings"
import { SearchErrors } from "./Filters/SearchErrors"
import { SearchKinds } from "./Filters/SearchKinds"

export const FILTERS_LIST: FilterItem[] = [
    {
        searchId: "kinds",
        payload: "kinds",
        title: "Kinds",
        component: SearchKinds,
    },
    {
        searchId: "markers",
        payload: "markers",
        title: "Markers",
        component: SearchMarkers,
    },
    {
        searchId: "labels",
        payload: "labels",
        title: "Labels",
        component: SearchLabel,
        isEditable: true,
    },
    {
        searchId: "annotations",
        payload: "annotations",
        title: "Annotations",
        component: SearchAnnotation,
        isEditable: true,
    },
    {
        searchId: "warnings",
        payload: "warnings",
        title: "Warnings",
        component: SearchWarnings,
    },
    {
        searchId: "errors",
        payload: "errors",
        title: "Errors",
        component: SearchErrors,
    },
]
