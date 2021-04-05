import { FilterComponentData } from "@kubevious/ui-search"

export interface FilterEntry {
    caption: string
    value: any
}

export interface AutocompleteValues {
    labels: {
        keys: []
        values: []
    }
    annotations: {
        keys: []
        values: []
    }
}

export interface FilterComponentProps {
    data: FilterComponentData
    addFilter: (filterId: string, caption: string, value: any) => void
    removeFilter: (filterId: string) => void
    removeAllFilters: (
        e:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => void
}
