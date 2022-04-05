import React from "react"
import { isEmptyArray } from "../../utils/util"
import { InternalMetricsItem } from "./types"

export const InternalMetricsTable = ({ result }: { result: InternalMetricsItem[] }): JSX.Element => {
    return (
        <div className="p-40 overflow-hide">
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {!isEmptyArray(result) &&
                        result.map((item: InternalMetricsItem, index: number) => (
                            <tr key={index}>
                                <td>
                                    {(item.category
                                        ? item.category + " :: "
                                        : "") + item.name}
                                </td>
                                <td>{item.value}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
