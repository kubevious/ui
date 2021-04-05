export type List = {
    payload: string
    shownValue: string
}

export type FilterObjectType = {
    key?: string
    value?: string
    kind?: string
    count?: number
}

export type FilterType = FilterObjectType | string

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
    removeAllFilters: (e) => void,
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
    isEnabled: boolean
}


