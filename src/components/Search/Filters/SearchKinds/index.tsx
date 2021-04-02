import React, { FC, useState, useEffect } from "react"
import { KindList, KindListValue } from "./types"
import _ from "lodash"
import { FilterComponentProps } from "../../types"
import { KIND_TO_USER_MAPPING } from "@kubevious/helpers/dist/docs"

export const SearchKinds: FC<FilterComponentProps> = ({
    data,
    addFilter,
    removeFilter,
    removeAllFilters,
}) => {
    const selectedKind = data.filters?.kind?.caption
    const [kinds, setKinds] = useState<KindList>({
        payload: "kind",
        shownValue: "Kind",
        values: [],
    })
    const getKindsList = (): void => {
        let kindsArray = Object.entries(KIND_TO_USER_MAPPING)
        let newKindsArray = kindsArray
            ? kindsArray.map(([key, value]) => ({ title: value, payload: key }))
            : []
        newKindsArray =
            _.orderBy(newKindsArray, (x: KindListValue) => x.title) || []
        setKinds({
            payload: "kind",
            shownValue: "Kind",
            values: newKindsArray,
        })
    }

    useEffect(() => {
        getKindsList()
    }, [])

    const kindFilterChange = (title: string, payload: string): void => {
        selectedKind === payload
            ? removeFilter("kind")
            : addFilter("kind", title, payload)
    }

    return (
        <div className="inner-items">
            {kinds.values &&
                kinds.values.map((item) => {
                    return (
                        <button
                            key={item.payload}
                            className={
                                selectedKind === item.title
                                    ? "selected-filter"
                                    : ""
                            }
                            onClick={() =>
                                kindFilterChange(item.title, item.payload)
                            }
                        >
                            {item.title || ""}
                        </button>
                    )
                })}
        </div>
    )
}
