import React, { useEffect, useState } from "react"
import { KindList, KindListValue, MarkersList } from "../types"
import { SearchFilterExpander } from "../SearchFilterExpander"
import { sharedState } from "../../../configureService"
import { FILTERS_LIST } from "../../../boot/filterData"
import { KIND_TO_USER_MAPPING } from "@kubevious/helpers/dist/docs"
import _ from "lodash"
import { FilterItem } from "../../../types"

export const SearchFilterList: React.FunctionComponent<{}> = () => {
    const [isKinds, setIsKinds] = useState<boolean>(false)

    const [kinds, setKinds] = useState<KindList>({
        payload: "",
        shownValue: "",
        values: [],
    })

    const getKindsList = (): KindList => {
        let kindsArray = Object.entries(KIND_TO_USER_MAPPING)
        let newKindsArray = kindsArray
            ? kindsArray.map(([key, value]) => ({ title: value, payload: key }))
            : []
        newKindsArray =
            _.orderBy(newKindsArray, (x: KindListValue) => x.title) || []

        return {
            payload: "kind",
            shownValue: "Kind",
            values: newKindsArray,
        }
    }

    useEffect(() => {
        const is_kinds = !!sharedState.get("is_kinds")
        setIsKinds(!!is_kinds)

        if (is_kinds) {
            setKinds(getKindsList())
        }
    }, [])

    // const filtersList = isKinds ? [kinds, ...FILTERS_LIST] : FILTERS_LIST

    return (
        <div className="filter-list filter-box">
            {FILTERS_LIST &&
                FILTERS_LIST.map((el: FilterItem) => {
                    return (
                        <SearchFilterExpander
                          filter={el}
                        />
                    )
                })}
        </div>
    )
}
