import _ from "the-lodash"
import React from "react"

import "./styles.scss"

// value: Config | string | {}
export const PropertiesValue = (value: any): JSX.Element => {
    if (_.isObject(value) && _.isNotNullOrUndefined(value.value)) {
        value = formatValue(value)
        return (
            <span>
                {formatValue(value.value || value)}
                {value.unit && <span>{value.unit}</span>}
            </span>
        )
    } else {
        return <span>{_.toString(value)}</span>
    }
}

function formatValue(value: {
    unit: string
    value: number
}):
    | number
    | "0 Bytes"
    | {
          value: number
          unit: string
      }
    | {
          value: string
          unit: string
      } {
    switch (value.unit) {
        case "%":
            return {
                value: (value.value * 100).toFixed(2),
                unit: "%",
            }
        case "bytes":
            return formatMemory(value.value, 2)

        default:
            const result =
                value.value || value.value === 0 ? value.value : value
            return result
    }
}

const MEMORY_SIZES = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
function formatMemory(
    value: number,
    decimals: number
):
    | "0 Bytes"
    | {
          value: number
          unit: string
      } {
    if (value === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const i = Math.floor(Math.log(value) / Math.log(k))
    return {
        value: parseFloat((value / Math.pow(k, i)).toFixed(dm)),
        unit: MEMORY_SIZES[i],
    }
}