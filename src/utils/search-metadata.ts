import { FilterItem } from "@kubevious/ui-search"

import { SearchLabel } from "../components/Filters/SearchLabel"
import { SearchMarkers } from "../components/Filters/SearchMarkers"
import { SearchAnnotation } from "../components/Filters/SearchAnnotation"
import { SearchWarnings } from "../components/Filters/SearchWarnings"
import { SearchErrors } from "../components/Filters/SearchErrors"
import { SearchKinds } from "../components/Filters/SearchKinds"

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
