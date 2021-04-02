import { Search } from "."
import { SelectedData, EditorItem } from "../../types"

export type List = {
    payload: string
    shownValue: string
}

export type KindListValue = {
    title: string
    payload:
        | {
              kind: string
              count: number
          }
        | string
}

export interface KindList extends List {
    values: KindListValue[]
}

export interface MarkersList extends List {
    values: EditorItem[]
}

export type FilterObjectType = {
    key?: string
    value?: string
    kind?: string
    count?: number
}

export type FilterType = FilterObjectType | string

export type SearchValue = {
    criteria?: string
    kind?: string
    markers?: string[]
    labels?: {
        key: string
        value: string
    }
    annotations?: {
        key: string
        value: string
    }
    error?: {
        kind: string
        count?: number
    }
}

export type CurrentInput = {
    labels: {
        key: string
        value: string
        disabled?: boolean
    }
    annotations: {
        key: string
        value: string
        disabled?: boolean
    }
}

export type Autocomplete = {
    labels: {
        keys: string[];
        values: string[];
    };
    annotations: {
        keys: string[];
        values: string[];
    };
}

export type SearchState = {
    result: SelectedData[]
    totalCount: number
    value: SearchValue
    savedFilters: SearchValue
    currentInput: CurrentInput
    autocomplete: Autocomplete
    wasFiltered?: boolean,
    markers?: string[]

}

export type FiltersList = {
    payload: string;
    shownValue: string;
    values: {
        title: string;
        payload: string;
    }[] | {
        title: string;
        payload: {
            kind: string;
            count: number;
        };
    }[];
}

export type SearchProps = {
    isKinds?: boolean,
    isMarkers?: boolean,
    filterList?: FiltersList[]
}

export type SearchFilterItemProps = {
    value: SearchValue
    el: KindList
    parent: Search
    autocomplete: Autocomplete
    currentInput: CurrentInput
}

// TODO: Move types above to /Filters/**/types.ts

/********/



export interface FilterData {
    isEnabled: boolean
    criteria: FilterCriteria[]
}

export interface FilterCriteria {
    caption: string
    values: any
}

export interface FilterComponentProps
{
    data: FilterComponentData,
    addFilter: (filterId: string, caption: string, value: any) => void,
    removeFilter: (filterId: string) => void,
    removeAllFilters: () => void,
}

export interface FilterItem {
    searchId: string
    payload: string
    title: string
    component: React.ComponentType<FilterComponentProps>
    data?: FilterData
}


/*******/


export interface SearchData
{
    components: Record<string, FilterComponentData>
}

export interface FilterComponentData
{
    searchId: string,
    filters: Record<string, FilterValue>
}

export interface FilterValue
{
    searchId: string,
    filterId: string,
    caption: string,
    value: any
    isActiveFilter: boolean
}


